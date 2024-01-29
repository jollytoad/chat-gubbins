import { byMethod } from "$http_fns/by_method.ts";
import type { RequestProps, WithSupabase } from "../../../types.ts";
import { getBodyAsObject } from "$http_fns/request/body_as_object.ts";
import { renderSecure } from "../../../lib/render.ts";
import { ChatMessage } from "../../../components/ChatMessage.tsx";
import { getProfileForCurrentUser } from "../../../lib/profile.ts";
import OpenAI from "openai/mod.ts";
import { ulid } from "$std/ulid/mod.ts";

interface FormBody {
  prompt?: string;
}

export default byMethod({
  POST: renderSecure(Converse),
});

async function* Converse(props: RequestProps & WithSupabase) {
  const data = await getBodyAsObject<FormBody>(props.req);

  if (data.prompt) {
    const profile = await getProfileForCurrentUser(props.supabase);

    yield (
      <chat-message>
        <chat-author role="user">
          {profile?.display_name ?? "Unknown"}
        </chat-author>
        <chat-prompt>{data.prompt}</chat-prompt>
      </chat-message>
    );
    yield <ahx-flush />;

    const openai = new OpenAI();

    const id = ulid();

    const model = "gpt-3.5-turbo-1106";

    const stream = await openai.beta.chat.completions.stream({
      messages: [{ role: "user", content: data.prompt }],
      model,
      stream: true,
    });

    const authorSlotName = `chat-author-reply-${id}`;
    const contentSlotName = `chat-streaming-${id}`;
    // const nextChunkSlotName = `chat-chunk-next-${id}`;

    yield (
      <chat-message id={id}>
        <slot ahx-slot-name={authorSlotName}>
          <chat-author role="assistant">{model} (maybe)</chat-author>
        </slot>
        <slot ahx-slot-name="chat-pending">...</slot>
        <chat-generated ahx-slot-name={contentSlotName}></chat-generated>
      </chat-message>
    );
    yield <ahx-flush />;

    let authorEmitted = false;

    for await (const chunk of stream) {
      if (!authorEmitted) {
        const role = chunk.choices[0]?.delta?.role ?? "assistant";
        yield (
          <chat-author role={role} ahx-slot={authorSlotName}>
            {chunk.model}
          </chat-author>
        );
        authorEmitted = true;
      }

      const content = chunk.choices[0]?.delta?.content ?? "";

      if (content) {
        yield (
          <chat-chunk ahx-slot={contentSlotName} ahx-swap="beforeEnd">
            {content}
          </chat-chunk>
        );
        yield <ahx-flush />;
      }
    }

    const completion = await stream.finalChatCompletion();

    console.log(completion);
  }
}
