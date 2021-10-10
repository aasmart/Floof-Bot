import { verify } from './verify'
import { InteractionType, InteractionResponseType, APIInteractionResponse, APIApplicationCommandInteraction, MessageFlags } from 'discord-api-types/v9'
import { APIPingInteraction } from 'discord-api-types/payloads/v9/_interactions/ping'

const baseURL: string = "https://cdn.discordapp.com/attachments/"
const chinchillas: string[] = [
];

export async function handleRequest(request: Request): Promise<Response> {
  if(!request.headers.get('X-Signature-Ed25519') || !request.headers.get('X-Signature-Timestamp')) 
    return Response.redirect('https://aasmart.github.io')

  if(!await verify(request)) 
    return new Response('', { status: 401 })

  const interaction = await request.json() as APIPingInteraction | APIApplicationCommandInteraction

  if(interaction.type === InteractionType.Ping)
    return respond({
      type: InteractionResponseType.Pong
    });

  if(interaction.data.name === "floof") {
    const random = Math.floor(Math.random() * chinchillas.length);
    const floofball = chinchillas[random];
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `Here's your floof: ${baseURL}${floofball}`,
        flags: 1 << 6
      }
    });
  }
  
  return new Response();
}

const respond = (response: APIInteractionResponse) =>
  new Response(JSON.stringify(response), {headers: {'content-type': 'application/json'}})
