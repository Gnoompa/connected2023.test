// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tokenId = searchParams.get("id");
  const handle = process.env.API_KEY;

  var myHeaders = new Headers();
  myHeaders.append("Authorization", process.env.AUTH);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  const NFTOwnerResponse = await await fetch(
    `https://nft.api.infura.io/networks/56/nfts/0xf38a4a99352c266da17bcc6fb15b01a36d25f2ab/${tokenId}/owners/`,
    requestOptions
  ).then((response) => response.json());

  //   const ccProfile = fetch("https://api.cyberconnect.dev/", {
  //   "headers": {
  //     "accept": "*/*",
  //     "accept-language": "en-US,en;q=0.9,ml;q=0.8,ja;q=0.7,ru;q=0.6",
  //     "content-type": "application/json",
  //     "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": "\"macOS\"",
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "cross-site",
  //     "x-api-key": "FkgQOpScPAK1AVBpnZBowugCjNKtlNqN"
  //   },
  //   "referrer": "https://studio.apollographql.com/",
  //   "referrerPolicy": "strict-origin-when-cross-origin",
  //   "body": "{\"query\":\"query Address($address: AddressEVM!) {\\n  address(address: $address) {\\n    wallet {\\n      primaryProfile {\\n      handle\\n      }\\n    }\\n  }\\n}\",\"variables\":{\"address\":\"0x5b3999bc2e8c46f75BF629DA951559D83E34FBdD\"},\"operationName\":\"Address\"}",
  //   "method": "POST",
  //   "mode": "cors",
  //   "credentials": "include"
  // }).then((response) => response.text());

  return new Response(
    NFTOwnerResponse.owners[0].ownerOf,
    // `<svg width="286" height="344" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="286" height="344"><path d="M0 63.435a59.805 59.805 0 0 1 6.645-27.398l12.306-23.876A22.446 22.446 0 0 1 38.903 0H271.037C279.301 0 286 6.696 286 14.957v290.579a22.432 22.432 0 0 1-8.931 17.913l-17.265 13.014A37.421 37.421 0 0 1 237.281 344H14.963C6.699 344 0 337.304 0 329.043V63.435z" fill="#000"/></mask><g mask="url(#a)"><path fill="#04297C" d="M0 0h286v344H0z"/></g><g clip-path="url(#b)"><path d="M249.123 116.117c-.253-.092-.23.168-.296.269-.321.494-.58 1.037-.955 1.484-1.079 1.284-2.486 2.094-4.061 2.604-2.968.962-5.937.914-8.853-.19-1.707-.646-3.211-1.625-4.136-3.276-.782-1.395-.967-2.852-.179-4.318.775-1.443 2.397-2.273 4.002-2.015 1.571.253 2.86 1.269 3.259 2.926.329 1.367.042 2.638-.993 3.67-.275.274-.556.543-.822.826-.582.622-.562 1.2.016 1.831.444.484 1.022.69 1.629.747.803.076 1.608.177 2.424.07 1.843-.242 3.139-2.169 2.656-3.975-.239-.894-.754-1.617-1.356-2.293-1.161-1.302-2.549-2.342-3.912-3.409-1.588-1.245-3.209-2.451-4.611-3.913-.906-.945-1.712-1.963-2.237-3.186-1.282-2.985-.238-5.537 2.405-7.021 1.332-.747 2.77-1.145 4.285-1.319 1.896-.217 3.725.05 5.532.607.833.257 1.658.544 2.552.564.583.013 1.123-.04 1.612-.383.108-.077.237-.123.422-.215v8.265c-.3.002-.29-.227-.341-.412-.204-.746-.378-1.503-.625-2.235-.501-1.486-1.216-2.857-2.362-3.957-1.292-1.241-2.825-1.902-4.632-1.855-.958.025-1.674.474-2.112 1.325-.57 1.106-.571 2.237-.032 3.353a7.097 7.097 0 0 0 1.941 2.419c1.596 1.299 3.225 2.557 4.843 3.828 1.301 1.023 2.546 2.103 3.543 3.441.478.642.888 1.319 1.15 2.081.03.087.112.156.207.195.037 1.111.037 2.26.037 3.467zM37.355 106.095c.407-2.333 1.28-4.459 2.783-6.308 1.779-2.187 4.03-3.6 6.81-4.093 2.075-.368 4.095-.082 6.03.74 1.737.74 3.24 1.803 4.38 3.331.657.882 1.12 1.844 1.11 2.985-.025 2.92-3.076 4.621-5.524 3.531a3.932 3.932 0 0 1-1.545-5.969c.32-.423.667-.825.975-1.256.29-.406.468-.871.393-1.377-.097-.651-.55-1.031-1.118-1.272-.954-.402-1.961-.532-2.986-.475-.48.026-.825.366-1.085.726-.44.61-.891 1.23-1.215 1.904-1.31 2.732-1.764 5.639-1.485 8.639.253 2.723 1.06 5.269 2.77 7.466.854 1.1 1.877 1.987 3.18 2.505 2.19.871 4.186.418 6.015-.968.402-.305.744-.689 1.11-1.041.15-.145.286-.335.492-.016a10.98 10.98 0 0 1-2.463 3.142c-1.616 1.439-3.472 2.403-5.64 2.713-2.439.35-4.753-.007-6.885-1.266-3.556-2.101-5.48-5.296-6.114-9.333-.014-.087-.08-.166-.17-.249a33.359 33.359 0 0 1-.003-3.122c.093-.341.14-.639.185-.937z" fill="#FDFDFD"/><path d="M37.327 106.118a3.464 3.464 0 0 1-.157.856c-.047-.185-.047-.356-.047-.578.058-.118.117-.186.204-.278z" fill="#585858"/><path d="M104.354 100.157c.458-.522.891-.998 1.064-1.666.149-.576-.033-1.004-.448-1.36-.513-.443-1.148-.625-1.797-.697-2.032-.224-3.97.14-5.813 1.024-.054.026-.098.071-.17.125v.597c0 6.551.011 13.102-.01 19.653-.005 1.229.726 2.332 1.845 2.656.104.031.186.138.324.246-.51.151-10.913.195-11.896.066.097-.128.15-.277.235-.3 1.338-.362 1.922-1.597 1.916-2.794-.029-5.752-.016-11.505-.01-17.257.002-.953-.26-1.773-1.059-2.344a2.767 2.767 0 0 0-.766-.363c-.231-.074-.297-.186-.222-.428 1.211-.177 2.433-.355 3.654-.535 1.586-.235 3.173-.466 4.757-.709.752-.115 1.123.147 1.274.97.152-.06.299-.111.44-.174 2.139-.94 4.368-1.453 6.707-1.302 1.708.11 3.272.626 4.477 1.945.768.84 1.208 1.839 1.41 2.939.106.578.15 1.175.152 1.763.011 5.118.003 10.236.013 15.354.001.424.031.869.161 1.267.26.796.804 1.365 1.621 1.62.203.063.35.11.252.385h-11.67c-.099-.228.017-.3.2-.352a2.47 2.47 0 0 0 1.218-.772c.433-.501.621-1.073.619-1.743-.011-4.708.019-9.417-.022-14.125-.012-1.327.352-2.444 1.257-3.394.084-.089.171-.176.287-.295zM217.468 99.685c-.25-.996-.821-1.634-1.745-1.95-.199-.067-.196-.074-.258-.417l2.874-.422c1.827-.266 3.656-.524 5.482-.802.902-.137 1.303.182 1.303 1.102.002 6.531.017 13.062-.012 19.592-.006 1.34.777 2.391 1.868 2.701.103.029.182.149.344.29-.257.083-.4.153-.55.175-2.109.306-4.219.606-6.329.908-.582.083-1.163.198-1.748.239-.889.063-1.179-.227-1.211-1.115-.003-.102 0-.204 0-.364-.155.048-.284.073-.399.127-2.22 1.042-4.554 1.522-6.999 1.349-1.584-.112-3.023-.631-4.155-1.816-.861-.901-1.344-1.992-1.53-3.208a13.223 13.223 0 0 1-.146-1.948c-.012-4.607-.007-9.213-.005-13.819 0-1.02-.386-1.825-1.28-2.345-.19-.11-.411-.169-.623-.239-.223-.074-.197-.22-.121-.412l4.563-.663c1.265-.184 2.532-.358 3.795-.553.892-.138 1.263.159 1.263 1.06.001 5.426-.005 10.851.006 16.277a3.523 3.523 0 0 1-.818 2.311c-.399.489-.834.949-1.234 1.438-.285.349-.493.732-.535 1.208-.057.642.251 1.048.753 1.355.643.394 1.368.541 2.097.577 1.865.093 3.634-.323 5.336-1.121.011-.103.03-.202.03-.302 0-6.387-.003-12.774-.016-19.213z" fill="#FEFEFE"/><path d="M176.351 105.771c.249-1.193.568-2.311 1.083-3.36 1.62-3.3 4.079-5.65 7.707-6.54 3.645-.894 6.897.027 9.701 2.477 2.419 2.113 3.756 4.835 4.181 8.007.471 3.513-.184 6.789-2.19 9.739-1.645 2.419-3.858 4.086-6.729 4.75-3.075.713-5.959.173-8.551-1.636-2.731-1.905-4.364-4.571-5.097-7.805a13.122 13.122 0 0 1-.338-3.273c.022-.77.15-1.537.233-2.359zm8.53 12.206c.27.73.584 1.433 1.114 2.024.975 1.088 2.493 1.032 3.427-.137.642-.803.971-1.741 1.239-2.707.608-2.195.755-4.457.828-6.713.074-2.305.053-4.613-.177-6.916-.134-1.341-.297-2.671-.647-3.973-.283-1.05-.634-2.071-1.384-2.899-.722-.798-1.796-.987-2.706-.414-.353.221-.664.544-.917.88-.484.64-.757 1.395-.974 2.164-.635 2.252-.861 4.563-.884 6.889-.021 2.124.037 4.25.119 6.373.069 1.817.359 3.606.962 5.429zM64.957 117.51c-1.672-1.793-2.702-3.877-3.184-6.223-.576-2.806-.375-5.567.723-8.225 1.234-2.987 3.238-5.295 6.226-6.599 3.272-1.427 6.521-1.253 9.608.552 3.359 1.963 5.234 4.999 5.958 8.775.524 2.733.227 5.399-.848 7.968-1.144 2.737-2.994 4.851-5.628 6.225-1.443.753-2.99 1.114-4.637 1.141-2.717.044-5.065-.856-7.132-2.571-.374-.311-.705-.673-1.086-1.043zM70.5 97.987c-.265.856-.594 1.698-.781 2.57-.478 2.218-.592 4.48-.629 6.742-.033 2.083.023 4.163.236 6.238.145 1.402.359 2.792.784 4.135.295.934.688 1.826 1.436 2.525.822.767 2.095.779 2.862.019.3-.298.57-.643.79-1.005.445-.739.691-1.563.892-2.398.547-2.271.701-4.589.748-6.912.049-2.388.02-4.778-.259-7.156-.166-1.419-.388-2.827-.876-4.176-.28-.772-.64-1.501-1.258-2.075-.825-.768-2.05-.78-2.878-.022a4.358 4.358 0 0 0-1.067 1.515zM118.475 107.345c-1.124-1.121-2.102-2.302-2.601-3.788-.704-2.099-.479-4.017 1.22-5.615.804-.758 1.745-1.268 2.762-1.647a12.176 12.176 0 0 1 4.978-.735c1.263.07 2.487.373 3.693.753.776.245 1.552.489 2.382.489.534 0 1.048-.042 1.499-.377.121-.09.275-.133.481-.23v8.246c-.316.108-.305-.124-.353-.292-.215-.765-.41-1.536-.65-2.293-.429-1.357-1.069-2.61-2.038-3.66-1.386-1.5-3.098-2.297-5.166-2.182-1.216.068-2.191 1.262-2.299 2.619-.124 1.55.591 2.714 1.583 3.768 1.279 1.36 2.802 2.429 4.281 3.548 1.318.997 2.633 1.996 3.782 3.192.94.979 1.749 2.049 2.2 3.351.73 2.11.319 3.982-1.203 5.602-1.422 1.513-3.224 2.338-5.218 2.745-2.848.581-5.638.372-8.288-.888-1.6-.762-2.959-1.834-3.644-3.544-.618-1.545-.552-3.053.566-4.372 1.026-1.209 2.363-1.643 3.898-1.271 1.531.371 2.531 1.356 2.919 2.897.388 1.539-.147 2.8-1.257 3.864-.25.239-.507.477-.718.748-.447.572-.325 1.03.035 1.496.309.399.72.695 1.208.789.954.186 1.917.314 2.897.184 1.448-.192 2.693-1.254 2.838-3.046.078-.96-.319-1.824-.919-2.533-.697-.821-1.445-1.615-2.265-2.31-1.678-1.422-3.426-2.763-5.131-4.154-.504-.412-.962-.881-1.472-1.354zM156.605 106.247c-2.343 1.08-4.904-.362-5.428-2.53-.269-1.111-.18-2.192.489-3.166.219-.319.47-.615.7-.927.206-.278.436-.545.597-.849.492-.922.233-1.797-.702-2.265-.43-.215-.91-.352-1.383-.453-.433-.094-.888-.082-1.33-.136-.664-.08-1.128.245-1.529.718-1.011 1.189-1.608 2.59-2.059 4.062-.548 1.786-.812 3.622-.725 5.488.14 3.009.88 5.839 2.699 8.303.888 1.202 1.979 2.171 3.394 2.71 2.177.829 4.153.376 5.954-1.014.479-.37.907-.807 1.369-1.223.262.063.218.238.109.407-.264.412-.523.83-.816 1.221-1.543 2.056-3.529 3.51-6.015 4.171-2.791.741-5.5.444-8.022-1.014-3.201-1.849-5.078-4.678-5.939-8.238a13.24 13.24 0 0 1-.325-4.193c.247-3.052 1.308-5.78 3.395-8.074 1.735-1.907 3.846-3.138 6.381-3.555 2.763-.455 5.331.16 7.697 1.645 1.225.77 2.261 1.734 3.035 2.97 1.026 1.639 1 3.379-.076 4.8-.379.5-.872.851-1.47 1.142zM129.051 133.107a11.135 11.135 0 0 1 3.338 5.435c.861 3.164.607 6.239-.933 9.145-1.577 2.978-3.986 4.909-7.342 5.543a4.674 4.674 0 0 1-.853.065c-3.716.004-7.433.003-11.15.002-.139 0-.278-.016-.558-.034.203-.112.287-.189.382-.207 1.082-.197 1.673-.888 1.674-1.993.002-6.019.001-12.039 0-18.058 0-1.233-.464-1.845-1.639-2.169a.537.537 0 0 1-.313-.198c.124-.023.248-.066.373-.067 3.676-.003 7.353-.061 11.027.019 2.27.05 4.269.949 5.994 2.517zm-9.681 13.966v5.92c1.506.252 2.755-.136 3.852-1.096 1.17-1.024 1.931-2.324 2.452-3.75 1.357-3.717 1.43-7.503.365-11.3-.502-1.788-1.319-3.427-2.701-4.727-1.108-1.042-2.408-1.457-3.968-1.262v16.215zM172.906 139.395c.728 3.975-.078 7.528-2.696 10.564-1.641 1.902-3.739 3.106-6.275 3.312-4.119.335-7.209-1.448-9.402-4.868-1.097-1.712-1.64-3.613-1.762-5.656-.19-3.198.671-6.046 2.691-8.522 1.536-1.884 3.503-3.113 5.904-3.517 2.92-.493 5.532.295 7.783 2.202 1.997 1.693 3.202 3.877 3.757 6.485zm-13.955 6.299c.165 1.085.267 2.185.511 3.252.255 1.111.647 2.176 1.377 3.104 1.081 1.375 3.199 1.335 4.236-.024.66-.865 1.037-1.84 1.312-2.87.572-2.144.634-4.347.723-6.543.034-.833-.062-1.67-.068-2.506a23.531 23.531 0 0 0-.545-4.909c-.237-1.077-.574-2.126-1.22-3.047-.76-1.083-1.846-1.533-3.004-1.235-.643.166-1.122.563-1.526 1.066-.628.781-.94 1.707-1.206 2.654-.46 1.638-.614 3.324-.698 5.009-.097 1.977-.088 3.959.108 6.049z" fill="#FDFDFD"/><path d="m161.783 97.264 7.271-1.085c.301-.044.601-.092.903-.129.666-.081 1.099.291 1.125.962.006.143.001.287.001.43v20.442c0 1.297.552 2.113 1.757 2.577.158.061.33.075.254.356h-11.645c-.125-.25.043-.292.234-.355.758-.248 1.315-.732 1.594-1.489.097-.261.16-.552.16-.83.009-6.016.01-12.032.004-18.048-.001-1.074-.568-1.795-1.5-2.258-.107-.054-.246-.053-.341-.12-.085-.059-.13-.176-.193-.267.108-.06.216-.12.376-.186z" fill="#fff"/><path d="M139.582 140.134c.446-1.268.886-2.537 1.339-3.802.653-1.822 1.316-3.641 1.977-5.46.027-.075.077-.142.152-.278.203.568.39 1.081.569 1.598l5.243 15.138c.466 1.349.945 2.693 1.391 4.048.326.992.941 1.596 2.007 1.683.062.005.12.066.219.124-.485.133-9.231.171-10.14.046.158-.087.238-.158.327-.176 1.091-.22 1.644-1.137 1.297-2.191-.28-.852-.579-1.698-.879-2.572h-6.161c-.371.653-.481 1.376-.353 2.139.134.801.554 1.44 1.169 1.952.585.488 1.293.681 2.044.755-.448.195-7.384.212-7.945.059.037-.05.063-.123.102-.132 2.115-.446 3.47-1.779 4.289-3.719.277-.656.493-1.337.795-2.046.105-.04.153-.04.199.004-.065.231-.129.417-.203.635h5.944l-2.898-8.355c-.124.255-.195.4-.303.544a8.963 8.963 0 0 0-.181.006z" fill="#FDFDFD"/><path d="M167.592 78.1c.089 1.15.139 2.306.283 3.449.078.615.311 1.21.491 1.81.044.147.151.274.25.446.904-.421 1.619-1.045 2.421-1.644.103.045.133.086.164.127-.574.784-1.266 1.487-1.665 2.44.646.45 1.376.63 2.111.716 1.148.136 2.305.192 3.512.325.059.088.063.132.068.176-1.052.085-2.105.147-3.153.26-.87.094-1.723.279-2.546.775.43 1.02 1.218 1.787 1.784 2.712-.93-.534-1.671-1.333-2.673-1.761-.403.436-.518.984-.635 1.512-.303 1.377-.4 2.779-.465 4.217a.346.346 0 0 1-.137.027c-.091-1.089-.166-2.18-.276-3.266-.088-.87-.301-1.71-.758-2.518-.888.405-1.585 1.02-2.383 1.598a.37.37 0 0 1-.179-.144c.588-.753 1.225-1.472 1.631-2.375-.779-.482-1.633-.677-2.5-.775-1.049-.118-2.105-.164-3.214-.292-.063-.073-.07-.096-.078-.118.237-.024.474-.06.712-.07 1.462-.071 2.925-.133 4.323-.632.244-.087.474-.213.757-.342-.448-1.047-1.225-1.807-1.797-2.72.517.186.866.606 1.305.892.457.299.907.61 1.384.931.495-.789.688-1.604.783-2.431.124-1.071.173-2.15.301-3.28.091-.051.135-.048.179-.045z" fill="#F8F8F8"/><path d="M139.557 140.17c.074-.038.122-.04.209.005a127.016 127.016 0 0 1-1.552 4.463c-.32.877-.659 1.748-.989 2.622h-.18c.201-.69.429-1.383.676-2.069a589.693 589.693 0 0 1 1.836-5.021z" fill="#DBDBDB"/><path d="M163.77 89.376c.071.028.105.076.179.144-.268.288-.576.555-.884.822a1.988 1.988 0 0 0-.049-.046c.239-.3.478-.6.754-.92zM171.237 82.269c-.067-.022-.098-.063-.162-.124.235-.256.503-.494.772-.732l.051.046c-.208.263-.416.527-.661.81zM167.594 78.049c-.046.048-.091.045-.168.042-.034-.582-.034-1.164-.034-1.746l.115-.008c.011.173.023.347.032.52.02.38.039.76.055 1.192zM175.284 85.95c-.062-.049-.066-.093-.069-.171.595-.004 1.187.025 1.78.055v.122c-.552 0-1.103 0-1.711-.005zM159.589 85.794c.064.026.071.048.08.106-.559.036-1.119.036-1.68.036l-.002-.12c.515-.008 1.031-.017 1.602-.022zM167.395 93.743c.031-.056.054-.055.112-.042.033.555.033 1.098.033 1.642l-.128.008c-.009-.253-.021-.506-.025-.76-.004-.263 0-.527.008-.848zM163.165 81.632c-.079-.067-.115-.114-.151-.161l.144-.048c.017.076.034.152.007.209zM171.892 90.303a.54.54 0 0 1-.227-.15l.064-.072a.58.58 0 0 1 .163.222z" fill="#BDBDBD"/><path d="M163.463 81.804c.088.043.121.115.154.186-.07-.053-.14-.105-.154-.186zM171.652 90.02c-.101-.046-.207-.084-.3-.143-.027-.017-.016-.095-.023-.146.063.01.125.02.212.137.053.121.082.137.111.152z" fill="#F8F8F8"/><path d="M171.568 89.924c.039-.01.075.031.098.085-.043-.003-.072-.02-.098-.085z" fill="#BDBDBD"/></g><defs><clipPath id="b"><path fill="#fff" transform="translate(37 76)" d="M0 0h212v86H0z"/></clipPath></defs><text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-weight="700" font-family="&quot;Outfit&quot;, sans-serif" font-size="19">${handle}</text></svg>`,
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
