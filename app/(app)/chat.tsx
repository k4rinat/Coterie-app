import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, Animated, Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FONT, RADIUS, SHADOW } from "@/constants/Colors";
import Label from "@/components/Label";
import Divider from "@/components/Divider";

// ── Éloi — Knowledge Base ─────────────────────────────────────────────────────
// Éloi is Coterie's concierge. He answers questions about the platform AND
// speaks as an authoritative, opinionated luxury fashion voice.

type KnowledgeEntry = { keywords: string[]; answers: string[]; zh?: string[]; fr?: string[]; it?: string[]; es?: string[] };
const KNOWLEDGE: KnowledgeEntry[] = [

  // ── FASHION CRITIC ─────────────────────────────────────────────────────────

  {
    keywords: ["quiet luxury", "old money", "stealth wealth", "understated", "no logo", "logoless", "subtle dressing", "靜奢", "老錢風", "低調奢華", "無logo", "無標誌", "luxe discret", "vieux argent", "lujo discreto", "lusso silenzioso"],
    zh: [
      "靜奢風格與其說是一種潮流，不如說是一種氣質——拒絕炫耀的姿態。其密碼耳熟能詳：精良的布料、考究的比例、取自石材與霧氣的色彩。Brunello Cucinelli 憑此建立了一個王國，The Row 將其法典化。有趣的是，解讀這套語言需要更深厚的知識，而非更淺。一位身穿 Loro Piana 無品牌喀什米爾大衣的女士，正在向懂行的人侃侃而談——而對外行人卻沉默無語。這種只有內行才能讀懂的排他性，本身就是要點所在。",
      "靜奢風格的諷刺之處在於，它已變得令人窒息地喧囂。當一種以匿名為前提的穿著方式成為熱門標籤，某種東西就已失落。那份最初的衝動——以確信而非訊號來穿衣——是正確的。但當下的版本往往只是將無 Logo 當作表演。真正的隱形富豪，不過是清楚自己在做什麼，並不在乎別人是否看見。",
    ],
    fr: [
      "Le luxe discret est moins une tendance qu'une disposition — un refus d'annoncer. Les codes sont familiers : tissu irréprochable, proportion réfléchie, palettes de couleurs tirées de la pierre et du brouillard. Brunello Cucinelli en a fait un empire. The Row l'a codifié. Ce qui est intéressant, c'est qu'il exige plus de connaissance pour être lu, pas moins. Une femme dans un manteau cachemire sans marque de Loro Piana parle couramment à ceux qui savent — et ne dit rien à ceux qui ne savent pas.",
    ],
    it: [
      "Il lusso silenzioso è meno una tendenza che una disposizione — un rifiuto di annunciare. I codici sono familiari: tessuto impeccabile, proporzioni studiate, palette di colori tratte dalla pietra e dalla nebbia. Brunello Cucinelli ci ha costruito un impero. The Row lo ha codificato. La cosa interessante è che richiede più conoscenza per essere letto, non meno.",
    ],
    es: [
      "El lujo discreto es menos una tendencia que una disposición — una negativa a anunciarse. Los códigos son familiares: tela impecable, proporción estudiada, paletas de colores extraídas de la piedra y la niebla. Brunello Cucinelli construyó un imperio sobre ello. The Row lo codificó. Lo interesante es que requiere más conocimiento para leerlo, no menos.",
    ],
    answers: [
      "Quiet luxury is less a trend than a disposition — a refusal to announce. The codes are familiar: impeccable cloth, considered proportion, colour palettes drawn from stone and fog. Brunello Cucinelli built an empire on it. The Row codified it. What's interesting is that it requires more knowledge to read, not less. A woman in an unbranded cashmere coat from Loro Piana is speaking fluently to those who know — and saying nothing to those who don't. That exclusivity of legibility is, itself, the point.",
      "The irony of quiet luxury is that it has become terribly loud. When a dressing style predicated on anonymity becomes a trending hashtag, something has been lost. The original impulse — to dress with certainty rather than signal — is correct. But the current version is often just logolessness as performance. True stealth wealth is simply knowing what you're doing, and not caring whether anyone sees it.",
    ],
  },
  {
    keywords: ["maximalism", "more is more", "excess", "print mixing", "print clashing", "bold dressing"],
    zh: [`極繁主義執行得好是一種編排，執行得差不過是噪音。Dries Van Noten 花了三十年證明印花衝撞並非混亂，而是一種極度的秩序。大多數極繁主義的失敗，根源在於缺乏信念。時裝對極繁主義的論據，部分是穿搭上的，部分是政治上的——Alessandro Michele 的 Gucci 不是關於穿得多，而是關於無所畏懼。`],
    fr: [`Le maximalisme bien exécuté est une orchestration ; mal exécuté, c'est du bruit. Dries Van Noten a passé trente ans à prouver que le clash de motifs n'est pas le chaos — c'est une forme d'ordre extrême. L'échec du maximalisme est presque toujours le manque de conviction. Le Gucci d'Alessandro Michele n'était pas une question de porter plus — c'était une question d'absence de peur.`],
    it: [`Il massimalismo ben eseguito è orchestrazione; male eseguito è rumore. Dries Van Noten ha trascorso trent'anni a dimostrare che il clash di stampe non è caos — è una forma di ordine estremo. Il fallimento del massimalismo è quasi sempre la mancanza di convinzione. Il Gucci di Alessandro Michele non riguardava il portare di più — riguardava l'assenza di paura.`],
    es: [`El maximalismo bien ejecutado es orquestación; mal ejecutado es ruido. Dries Van Noten pasó treinta años demostrando que el choque de estampados no es caos — es una forma de orden extremo. El fracaso del maximalismo es casi siempre la falta de convicción. El Gucci de Alessandro Michele no trataba de llevar más — trataba de la ausencia de miedo.`],
    answers: [
      "Maximalism done poorly is noise. Done well, it's orchestration. Dries Van Noten spent thirty years proving that print clashing is not chaos — it is, in fact, a form of extreme order, where every element must carry its own weight precisely because none has the room to hide. The failure of most maximalism is insufficient confidence. Conviction is the only coherence maximalism requires.",
      "The fashion argument for maximalism is partly sartorial, partly political. After several years of conspicuous restraint, the body dressed with deliberate abundance reads as defiant. Alessandro Michele understood this better than almost anyone. His Gucci wasn't about wearing everything — it was about being unafraid. The question isn't how much you wear; it's how much you mean it.",
    ],
  },
  {
    keywords: ["margiela", "maison margiela", "martin margiela", "deconstructed", "deconstruction"],
    zh: [`Martin Margiela 是過去四十年最具影響力的設計師，也是唯一一位理解匿名可以成為激進行動的人。他在非模特兒身上展示系列，衣服上不署名，並不斷追問：一件衣服在被決定應該是什麼之前，究竟是什麼？他的解構不是關於未縫合的接縫——而是本體論的。此後一切都欠他一份情。`],
    fr: [`Martin Margiela est le créateur le plus influent des quarante dernières années, et le seul à avoir compris que l'anonymat peut être un acte radical. Il présentait ses collections sur des non-mannequins, n'apposait aucun nom sur ses vêtements, et demandait constamment ce qu'était un vêtement avant de décider ce qu'il devrait être. Sa déconstruction n'était pas une affaire de coutures inachevées — elle était ontologique. Tout ce qui a suivi lui doit quelque chose.`],
    it: [`Martin Margiela è il designer più influente degli ultimi quarant'anni, e l'unico ad aver capito che l'anonimato può essere un atto radicale. Presentava le sue collezioni su non-modelle, non apponeva nomi sui suoi abiti, e chiedeva costantemente cosa fosse un capo prima di decidere cosa avrebbe dovuto essere. La sua decostruzione non riguardava le cuciture incompiute — era ontologica. Tutto ciò che è seguito gli deve qualcosa.`],
    es: [`Martin Margiela es el diseñador más influyente de los últimos cuarenta años, y el único que entendió que el anonimato puede ser un acto radical. Presentaba sus colecciones con no-modelos, no ponía nombre en su ropa, y preguntaba constantemente qué era una prenda antes de decidir qué debía ser. Su deconstrucción no era sobre costuras inacabadas — era ontológica. Todo lo que siguió le debe algo.`],
    answers: [
      "Martin Margiela is the most influential designer of the last forty years, and also the only one who understood that anonymity could be a radical act. He showed his collections on non-models, used no name on his clothes, and consistently asked what a garment was before he decided what it should be. Deconstruction, for Margiela, wasn't about unfinished seams — it was ontological. Everything since owes him a debt.",
      "The genius of Margiela is that his work is simultaneously intellectual and sensual. The Tabi boot is an idea — it splits the foot, questions the silhouette — but it is also deeply, unexpectedly elegant. Glenn Martens is doing genuinely interesting work continuing the house, though I think the codes are sometimes deployed more as reference than as conviction.",
    ],
  },
  {
    keywords: ["loewe", "jonathan anderson", "jw anderson", "craft", "spanish leather"],
    zh: [`Jonathan Anderson 在 Loewe 的十年，是奢侈時裝界最持續智識性的創意總監任期。他認真對待工藝——皮革技藝、陶瓷、與藝術家的合作——並以機智避免了時裝屋陷入虔誠的窠臼。他有一種罕見的能力：在概念上嚴肅的同時保持商業相關性。他生成創意，而不僅僅是執行。`],
    fr: [`Jonathan Anderson chez Loewe a été, durant la dernière décennie, le directeur créatif le plus régulièrement intelligent du luxe. Il prend l'artisanat au sérieux — la maroquinerie, les céramiques, les collaborations avec des artistes — et l'associe à un esprit qui préserve la maison du révérentiel. Il a la rare capacité d'être à la fois sérieux sur le plan conceptuel et pertinent commercialement.`],
    it: [`Jonathan Anderson da Loewe è stato, nell'ultimo decennio, il direttore creativo più costantemente intelligente nel lusso. Prende sul serio l'artigianato — la pelletteria, la ceramica, le collaborazioni con gli artisti — e lo combina con un'arguzia che impedisce alla maison di diventare reverenziale. Ha la rara capacità di essere concettualmente serio e commercialmente rilevante allo stesso tempo.`],
    es: [`Jonathan Anderson en Loewe ha sido, durante la última década, el director creativo más consistentemente inteligente en el lujo. Toma el oficio en serio — la marroquinería, la cerámica, las colaboraciones con artistas — y lo combina con un ingenio que evita que la maison se vuelva reverente. Tiene la rara capacidad de ser conceptualmente serio y comercialmente relevante al mismo tiempo.`],
    answers: [
      "Jonathan Anderson at Loewe has been, for the last decade, the most consistently intelligent creative director working in luxury fashion. He takes craft seriously in a way that isn't decorative — the leather artisanship, the ceramics, the collaborations with artists — and combines it with a wit that prevents the house from becoming reverent. He has the rare ability to be conceptually serious and commercially relevant at the same time.",
      "What Anderson understands about Loewe is that luxury and idea are not in conflict. The leather heritage gives him a material anchor; the Spanish craftsmanship tradition gives him permission to go further. His best work feels genuinely exploratory. This is rarer than it looks. Most creative directors can execute well. He generates.",
    ],
  },
  {
    keywords: ["bottega", "bottega veneta", "daniel lee", "matthieu blazy", "intrecciato"],
    zh: [`Matthieu Blazy 在 Bottega Veneta 是一個重要的才能。他將錯視感針織品偽裝成牛仔布、皮革、棉布的把戲，是一個認識論的遊戲——一個關於衣服是什麼以及它扮演什麼角色的問題。Bottega 的 intrecciato 編織是少數真正的奢侈品標誌之一：不是徽標，而是一種需要精湛技藝的技術，讀起來是精緻而非炫耀。`],
    fr: [`Matthieu Blazy chez Bottega Veneta est un talent significatif. Sa façon de faire ressembler des mailles trompe-l'œil à du denim, du cuir, du coton est un jeu épistémologique — une question sur ce qu'est un vêtement et ce qu'il performe. Le tressage intrecciato de Bottega est l'une des rares véritables signatures du luxe : pas un logo, mais une technique qui exige un savoir-faire artisanal et se lit comme raffinement plutôt qu'ostentation.`],
    it: [`Matthieu Blazy da Bottega Veneta è un talento significativo. Il suo gioco di far sembrare la maglieria trompe-l'œil come denim, pelle, cotone è un gioco epistemologico — una domanda su cosa sia un capo e cosa performi. L'intreccio intrecciato di Bottega è una delle poche vere firme del lusso: non un logo, ma una tecnica che richiede maestria artigianale e si legge come raffinatezza piuttosto che ostentazione.`],
    es: [`Matthieu Blazy en Bottega Veneta es un talento significativo. Su truco de hacer que el punto trompe-l'œil parezca denim, cuero, algodón es un juego epistemológico — una pregunta sobre qué es una prenda y qué representa. El tejido intrecciato de Bottega es una de las pocas firmas genuinas del lujo: no un logotipo, sino una técnica que requiere artesanía especializada y se lee como refinamiento en lugar de ostentación.`],
    answers: [
      "Matthieu Blazy at Bottega Veneta is a significant talent. His trick of making trompe-l'oeil knitwear look like denim, leather, cotton: it's an epistemological game, a question about what clothing is and what it performs. The house has a different kind of authority now — quieter, stranger, and in some ways more unsettling.",
      "Bottega's intrecciato weave is one of the few genuine luxury signatures — not a logo, but a technique that requires skilled artisanship and reads as refinement rather than display. Lee's Bottega was commercially transformative; Blazy's is philosophically interesting.",
    ],
  },
  {
    keywords: ["mcqueen", "alexander mcqueen", "lee mcqueen", "savage beauty"],
    zh: [`Alexander McQueen 以美的形式理解了黑暗，這或許是時裝界最罕見的感性。他從 1997 年到 2010 年的作品，構成了英國時裝業最具情感分量的作品集。他對魅力不感興趣——他想要的是讓人不安。2010 年 Lee McQueen 的離世，在英國時裝界留下了一個至今未癒合的傷口。`],
    fr: [`Alexander McQueen comprenait l'obscurité comme une forme de beauté — la sensibilité la plus rare dans la mode. Son travail de 1997 à 2010 constitue l'ensemble d'œuvres émotionnellement le plus significatif que l'industrie britannique ait produit. Il ne s'intéressait pas au glamour comme réassurance ; il voulait qu'il dérange. La perte de Lee McQueen en 2010 a laissé une blessure dans la mode britannique qui ne s'est pas refermée.`],
    it: [`Alexander McQueen capiva l'oscurità come una forma di bellezza — la sensibilità più rara nella moda. Il suo lavoro dal 1997 al 2010 costituisce il corpus emotivamente più significativo che l'industria britannica abbia prodotto. Non era interessato al glamour come rassicurazione; voleva che disturbasse. La perdita di Lee McQueen nel 2010 ha lasciato una ferita nella moda britannica che non si è ancora chiusa.`],
    es: [`Alexander McQueen entendía la oscuridad como una forma de belleza — la sensibilidad más rara en la moda. Su trabajo de 1997 a 2010 constituye el cuerpo de obra emocionalmente más significativo que la industria británica ha producido. No le interesaba el glamour como tranquilidad; quería que perturbara. La pérdida de Lee McQueen en 2010 dejó una herida en la moda británica que no se ha cerrado.`],
    answers: [
      "Alexander McQueen understood darkness as beauty, and that is perhaps the rarest sensibility in fashion. His work from 1997 to 2010 constitutes the most emotionally significant body of work the British industry has produced. He wasn't interested in glamour as reassurance; he wanted it to disturb. The Savage Beauty exhibition drew queues around the block because people sensed they were encountering something genuinely important.",
      "The loss of Lee McQueen in 2010 left a wound in British fashion that hasn't closed. The current house is searching, as it should be. What McQueen meant is too specific to simply continue.",
    ],
  },
  {
    keywords: ["valentino", "pierpaolo piccioli", "couture red", "valentino red"],
    zh: [`Pierpaolo Piccioli 的 Valentino 是過去十年最令人動容的時裝之一——他讓高訂感覺有情感存在的能力是非凡的。Alessandro Michele 現在接掌，將其極繁主義感性帶入一套截然不同的代碼。Valentino Red 是時裝史上最偉大的色彩主張之一：一種飽和到幾乎具有攻擊性的色調，以精準穿出時，攻擊性轉化為權威。`],
    fr: [`Le Valentino de Pierpaolo Piccioli était parmi les plus émouvants de la dernière décennie — sa capacité à rendre la haute couture émotionnellement présente était remarquable. Alessandro Michele prend maintenant la direction, apportant son intelligence maximaliste à un ensemble de codes très différent. Valentino Rouge est l'une des grandes propositions de couleur de l'histoire de la mode : une teinte assez saturée pour être presque agressive, portée avec une précision qui transforme l'agression en autorité.`],
    it: [`Il Valentino di Pierpaolo Piccioli era tra i più commoventi dell'ultimo decennio — la sua capacità di rendere la haute couture emotivamente presente era straordinaria. Alessandro Michele prende ora il comando, portando la sua intelligenza massimalista a un insieme di codici molto diversi. Il Rosso Valentino è una delle grandi proposte di colore nella storia della moda: una tonalità abbastanza satura da essere quasi aggressiva, indossata con una precisione che trasforma l'aggressività in autorità.`],
    es: [`El Valentino de Pierpaolo Piccioli fue uno de los más conmovedores de la última década — su capacidad para hacer que la alta costura se sintiera emocionalmente presente era extraordinaria. Alessandro Michele toma ahora las riendas, aportando su inteligencia maximalista a un conjunto de códigos muy diferentes. El Rojo Valentino es una de las grandes propuestas de color en la historia de la moda: un tono lo suficientemente saturado como para ser casi agresivo, llevado con una precisión que transforma la agresión en autoridad.`],
    answers: [
      "Pierpaolo Piccioli's Valentino was among the most moving fashion of the last decade. His ability to make couture feel emotionally present was remarkable. Alessandro Michele now takes over, bringing maximalist intelligence to a completely different set of codes. It will be interesting.",
      "Valentino Red is one of the great colour propositions in fashion history — a shade saturated enough to be almost aggressive, worn with a precision that transforms aggression into authority.",
    ],
  },
  {
    keywords: ["trend", "trends", "current season", "this season", "what to wear", "runway", "趨勢", "本季", "這一季", "時裝趨勢", "秀場", "當季", "tendance", "saison actuelle", "temporada actual", "tendenza", "questa stagione"],
    zh: [
      "本季的對話在靜謐與張力之間拉鋸。Bottega Veneta 繼續以克制的手法主導商業敘事——精良的剪裁、優質的皮革、無需解釋的形狀。與此同時，Valentino 和 Balenciaga 則在喧囂中尋求相關性，前者押注在藝術史上，後者依賴挑釁。真正引人關注的是那些正在悄然建立語彙的設計師——那些尚未出現在趨勢匯報上的名字，但正被最聰明的買手注意到的人。",
    ],
    fr: [
      "La conversation de cette saison se situe entre le calme et la tension. Bottega Veneta continue de dominer le récit commercial avec retenue. Les créateurs à suivre sont ceux qui construisent un vocabulaire silencieusement.",
    ],
    it: [
      "La conversazione di questa stagione si trova tra quiete e tensione. Bottega Veneta continua a dominare la narrativa commerciale con moderazione. I designer da seguire sono quelli che costruiscono un vocabolario in silenzio.",
    ],
    es: [
      "La conversación de esta temporada oscila entre la calma y la tensión. Bottega Veneta sigue dominando la narrativa comercial con contención. Los diseñadores a seguir son quienes construyen un vocabulario en silencio.",
    ],
    answers: [
      "The current conversation in fashion is broadly about the body and its relationship to structure. After several seasons of extreme volume, a number of houses are returning to a precise, architectural close-fitting line. Not bodycon — never bodycon — but aware. Balenciaga, Alaïa, and Saint Laurent are pulling in this direction. The counter-current is radical softness: unstructured garments that ask the wearer to animate them.",
      "What I notice this season is a serious rehabilitation of craft. Embroidery, tapestry weaving, hand-painted textile: the idea that a garment should carry evidence of the time it took to make it. At Dior, at Chanel's couture, at Valentino: the hand is everywhere.",
    ],
  },
  {
    keywords: ["creative director", "ceo change", "new appointment", "house news", "fashion news", "who is", "who runs"],
    zh: [`目前最受關注的創意任命是 Alessandro Michele 在 Valentino。他離開 Gucci 九年後，將其極繁主義-浪漫主義感性帶入一個骨架截然不同的時裝屋。還值得關注的：香奈兒在後 Lagerfeld 和後 Viard 時代持續尋找方向。此外：Glenn Martens 繼續執掌 Maison Margiela；Matthieu Blazy 在 Bottega Veneta；Jonathan Anderson 在 Loewe。`],
    fr: [`La nomination créative la plus suivie en ce moment est Alessandro Michele chez Valentino. Ayant quitté Gucci après neuf ans, il apporte sa sensibilité maximaliste-romantique à une maison aux codes très différents. À surveiller également : la situation continue chez Chanel, qui cherche une direction post-Lagerfeld et post-Viard. Glenn Martens continue chez Maison Margiela ; Matthieu Blazy reste chez Bottega Veneta.`],
    it: [`La nomina creativa più seguita in questo momento è Alessandro Michele da Valentino. Avendo lasciato Gucci dopo nove anni, porta la sua sensibilità massimalista-romantica in una maison con codici molto diversi. Da seguire anche: la situazione in corso da Chanel, che cerca una direzione post-Lagerfeld e post-Viard. Glenn Martens continua da Maison Margiela; Matthieu Blazy rimane da Bottega Veneta.`],
    es: [`El nombramiento creativo más seguido en este momento es Alessandro Michele en Valentino. Tras dejar Gucci después de nueve años, trae su sensibilidad maximalista-romántica a una maison con códigos muy diferentes. También a seguir: la situación continua en Chanel, que busca dirección post-Lagerfeld y post-Viard. Glenn Martens continúa en Maison Margiela; Matthieu Blazy permanece en Bottega Veneta.`],
    answers: [
      "The most closely-watched creative appointment right now is Alessandro Michele at Valentino. Having departed Gucci after nine years, he brings his maximalist-romantic sensibility to a house with very different bones. The tension between his vision and Valentino's couture heritage will either produce something extraordinary or something very strange. I'm prepared for either. Also worth watching: the ongoing situation at Chanel, which has been searching for direction post-Lagerfeld and post-Viard.",
      "Fashion house appointments to know: Alessandro Michele is now at Valentino. Glenn Martens continues at Maison Margiela. Matthieu Blazy remains one of the most interesting creative directors working, at Bottega Veneta. Jonathan Anderson at Loewe is now also doing his own label work. The CEO landscape: Antoine Arnault has taken a larger role within LVMH's governance. Kering continues to navigate a challenging luxury slowdown.",
    ],
  },
  {
    keywords: ["fashion history", "history of fashion", "coco chanel", "christian dior", "new look", "yves saint laurent", "archive"],
    zh: [`1947 年的「新風貌」或許是二十世紀時裝中最重要的單一輪廓。Dior 對戰時節儉的回應，是讓女裝達到最大化、反叛性的女性氣質：收腰、墊肩、飄逸裙擺。Yves Saint Laurent 1966 年的 Le Smoking——為女性設計的燕尾服套裝——是最直接改變女性被允許穿著的服裝。Le Smoking 至今仍被穿著，因為它的命題至今仍然正確。`],
    fr: [`Le New Look de 1947 est peut-être la silhouette unique la plus conséquente de la mode du vingtième siècle. La réponse de Dior à l'austérité de guerre était de rendre la mode féminine maximaliste et défiantement féminine : taille serrée, hanches rembourrées, jupe ample. Le Smoking d'Yves Saint Laurent de 1966 est le vêtement qui a le plus directement transformé ce que les femmes étaient autorisées à porter — et il se porte encore, parce que la proposition est encore juste.`],
    it: [`Il New Look del 1947 è forse la singola silhouette più conseguente nella moda del ventesimo secolo. La risposta di Dior all'austerità di guerra era rendere la moda femminile massimalmente, sfidatoriamente femminile: vita stretta, fianchi imbottiti, gonna ampia. Il Le Smoking di Yves Saint Laurent del 1966 è il capo che ha più direttamente trasformato ciò che le donne erano autorizzate a indossare — e si indossa ancora, perché la proposizione è ancora giusta.`],
    es: [`El New Look de 1947 es quizás la silueta única más consecuente en la moda del siglo XX. La respuesta de Dior a la austeridad de guerra fue hacer la moda femenina máximamente, desafiantemente femenina: cintura ceñida, caderas acolchadas, falda amplia. El Le Smoking de Yves Saint Laurent de 1966 es la prenda que más directamente transformó lo que las mujeres podían vestir — y sigue llevándose, porque la proposición sigue siendo correcta.`],
    answers: [
      "The New Look of 1947 is perhaps the single most consequential silhouette in twentieth-century fashion. Dior's response to wartime austerity was to make women's clothing maximally, defiantly feminine: nipped waist, padded hips, sweeping skirt. What's inarguable is that it reset the terms of postwar dressing and established Paris as the centre of luxury fashion for another three decades.",
      "Yves Saint Laurent's 1966 Le Smoking — the tailored tuxedo suit for women — is the garment that most directly transformed what women were permitted to wear. It took masculine authority and refused to apologise for it. The Le Smoking is still being worn because the proposition is still correct. That's the test of a great garment: not whether it's current, but whether it remains true.",
    ],
  },
  {
    keywords: ["how to dress", "personal style", "style advice", "build a wardrobe", "capsule wardrobe", "investment piece", "buy less", "quality"],
    zh: [`關於個人風格，最有用的問題不是「什麼適合我」，而是「我對穿衣這件事真正有什麼想法」。如果答案是幾乎沒有，就少買，但買更好的。如果你覺得它很有趣，那麼衣櫥就成為你隨時間與自己進行的對話。我的建議：買一件非常好的大衣。其他一切都從它開始——大衣是最先和最後被看見的，承載著比任何其他服裝更多的衣著信息。`],
    fr: [`La question la plus utile sur le style personnel n'est pas 'qu'est-ce qui me convient' mais 'qu'est-ce que je pense vraiment de s'habiller'. Si la réponse est très peu, achetez moins et achetez mieux. Si vous le trouvez intéressant, alors la garde-robe devient une conversation que vous avez avec vous-même au fil du temps. Mon conseil : achetez un très bon manteau. Tout le reste en découle — il porte plus d'informations sartoriales qu'aucun autre vêtement.`],
    it: [`La domanda più utile sullo stile personale non è 'cosa mi sta bene' ma 'cosa penso davvero del vestirsi'. Se la risposta è molto poco, comprate meno e comprate meglio. Se lo trovate interessante, allora il guardaroba diventa una conversazione con voi stessi nel tempo. Il mio consiglio: comprate un ottimo cappotto. Tutto il resto ne deriva — porta più informazioni sartoriali di qualsiasi altro capo.`],
    es: [`La pregunta más útil sobre el estilo personal no es 'qué me queda bien' sino 'qué pienso realmente sobre vestirse'. Si la respuesta es muy poco, compra menos pero compra mejor. Si lo encuentras interesante, el armario se convierte en una conversación que tienes contigo mismo a lo largo del tiempo. Mi consejo: compra un abrigo muy bueno. Todo lo demás se deriva de él — lleva más información sartorial que cualquier otra prenda.`],
    answers: [
      "The most useful question about personal style is not what suits me but what do I actually think about getting dressed. If the answer is very little, buy less and buy better. If the answer is I find it interesting, then the wardrobe becomes a conversation you're having with yourself over time. Neither approach is correct. But they require different wardrobes.",
      "My advice: buy one very good coat. Everything else follows from it. The coat is the first and last thing seen; it carries more sartorial information than any other garment; and a badly made coat cannot be rescued by what's underneath.",
    ],
  },
  {
    keywords: ["what to read", "fashion books", "fashion writing", "fashion journalism", "magazine", "publication", "reading list", "閱讀", "書單", "雜誌", "時尚書", "應讀什麼", "我應該讀", "lire", "livres de mode", "lecture", "leggere", "libri di moda", "leer", "libros de moda"],
    zh: [
      `必讀清單：Suzy Menkes 的早期評論（仍是新聞寫作的基準）；Vogue Paris 過去十年的任何一期；Holly Brubach 為 The New Yorker 撰寫的文章；以及 Colin McDowell 的《時尚之輪》——迄今為止關於這個行業最真實的書寫之一。

對於當代視角，我推薦 System Magazine（每一期都是工藝的典範）、Vestoj（學術思考的根基），以及 Business of Fashion 的深度報道系列。對於中文語境，《VOGUE 服飾與美容》繁體中文版的特稿有時比英文版更直接揭示亞洲市場的動態。`,
    ],
    fr: [
      "Liste de lecture essentielle : les critiques de Suzy Menkes, qui restent un étalon du journalisme de mode ; n'importe quel numéro de Vogue Paris de la dernière décennie ; les articles de Holly Brubach pour The New Yorker ; et System Magazine pour la réflexion contemporaine.",
    ],
    it: [
      "Lista di lettura essenziale: le critiche di Suzy Menkes; qualsiasi numero di Vogue Italia dell'ultimo decennio; System Magazine per la riflessione contemporanea; e Business of Fashion per l'analisi del settore.",
    ],
    es: [
      "Lista de lectura esencial: las críticas de Suzy Menkes; cualquier número de Vogue España de la última década; System Magazine para el pensamiento contemporáneo; y Business of Fashion para el análisis del sector.",
    ],
    answers: [
      "For fashion criticism, the best living writer is probably Cathy Horyn — rigorous, unimpressed by reputation, attentive to craft. Kennedy Fraser's The Fashionable Mind is the best book of fashion essays in English. For journalism, Business of Fashion is indispensable for the industry; System Magazine does the most serious long-form interviews.",
      "I'd recommend: Suzy Menkes's collected reviews for rigorous contemporaneous criticism; Diana Vreeland's D.V. for a kind of fashion intelligence that is unrepeatable; Anne Hollander's Sex and Suits is essential — she argues, correctly, that the suit is the most important garment of the last five centuries.",
    ],
  },
  {
    keywords: ["sustainable", "sustainability", "slow fashion", "second hand", "vintage", "resale", "fast fashion"],
    zh: [`時裝業與可持續性的關係，在很大程度上是一個關於傳播而非轉型的故事。真正有趣的發展是結構性的——租賃模式、高品質二手轉售平台、纖維材料創新。古著和二手轉售是對過度消費最直接、最誠實的回應：一件 1985 年製作精良的衣服，從定義上說，已然可持續——它已經存在了。`],
    fr: [`La relation de l'industrie de la mode avec la durabilité est largement une histoire de communication plutôt que de transformation. Les développements vraiment intéressants sont structurels — modèles de location, plateformes de revente haut de gamme, innovation matérielle. Le vintage et la revente sont les réponses les plus immédiates et honnêtes à la surconsommation : un vêtement bien fait de 1985 est, par définition, durable — il existe déjà.`],
    it: [`Il rapporto dell'industria della moda con la sostenibilità è in gran parte una storia di comunicazione piuttosto che di trasformazione. Gli sviluppi davvero interessanti sono strutturali — modelli di noleggio, piattaforme di rivendita di alta qualità, innovazione nei materiali. Il vintage e la rivendita sono le risposte più immediate e oneste al consumo eccessivo: un capo ben fatto del 1985 è, per definizione, sostenibile — esiste già.`],
    es: [`La relación de la industria de la moda con la sostenibilidad es en gran parte una historia de comunicación más que de transformación. Los desarrollos realmente interesantes son estructurales — modelos de alquiler, plataformas de reventa de alta calidad, innovación en materiales. El vintage y la reventa son las respuestas más inmediatas y honestas al consumo excesivo: una prenda bien hecha de 1985 es, por definición, sostenible — ya existe.`],
    answers: [
      "The fashion industry's relationship with sustainability is largely a story about communications rather than transformation. The genuinely interesting developments are structural — rental models, high-quality resale platforms, material innovation in fibre development. Stella McCartney has been the most consistent in making sustainability a design constraint rather than a PR exercise.",
      "Vintage and resale are the most immediate and honest responses to overconsumption. A well-made garment from 1985 is, by definition, sustainable — it already exists. The best-dressed people I know shop primarily secondhand. This is not a coincidence.",
    ],
  },
  {
    keywords: ["colour", "color", "palette", "tonal dressing", "monochrome", "neutral", "neutrals"],
    zh: [`色調穿搭——從頭到腳穿著同一色系——是以最少決策量穿出權威感最可靠的方式。它將身體變成一個連續的聲明，而非一系列相互競爭的元素。中性色不是顏色的缺席——它們是對顏色的一種特定論述。劣質布料在米色上立刻顯露無遺；一件錯配的白色比一件撞色印花更顯眼。`],
    fr: [`L'habillage tonal — porter une seule famille de couleurs de la tête aux pieds — est la manière la plus fiable de s'habiller avec autorité en nécessitant le moins de décisions. Il transforme le corps en une seule déclaration continue plutôt qu'une série d'éléments concurrents. Les neutres ne sont pas l'absence de couleur — ils sont un argument spécifique sur la couleur. Un tissu médiocre se lit immédiatement dans le beige.`],
    it: [`Il total look tonale — indossare una sola famiglia di colori dalla testa ai piedi — è il modo più affidabile di vestirsi con autorevolezza richiedendo il minimo di decisioni. Trasforma il corpo in un'unica dichiarazione continua piuttosto che una serie di elementi in competizione. I neutri non sono l'assenza di colore — sono un argomento specifico sul colore. Un tessuto mediocre si rivela immediatamente nel beige.`],
    es: [`El total look tonal — llevar una sola familia de colores de la cabeza a los pies — es la forma más fiable de vestirse con autoridad requiriendo las mínimas decisiones. Transforma el cuerpo en una declaración continua en lugar de una serie de elementos en competencia. Los neutros no son la ausencia de color — son un argumento específico sobre el color. Una tela mediocre se revela inmediatamente en el beige.`],
    answers: [
      "Tonal dressing — wearing one colour family head to toe — is the most reliable way to dress with authority that requires the least decision-making. It turns the body into a single continuous statement rather than a series of competing elements.",
      "Neutrals are not the absence of colour — they are a specific argument about colour. Bad cloth reads immediately in beige; a mismatched white is more visible than a clashing print. If you're going to dress in neutrals, the material quality has to be impeccable.",
    ],
  },
  {
    keywords: ["perfume", "fragrance", "scent", "accessories", "bag", "shoes", "jewellery", "jewelry", "watch", "handbag"],
    zh: [`包袋是最複雜的奢侈品購買，因為它存在於功能、地位與美學的交匯處——而大多數包袋至少在一個維度上失敗。真正偉大的包袋解決了全部三個問題：Hermès Kelly、Loewe Puzzle、Phoebe Philo 時代的 Céline 行李箱托特包。香水是時裝最私密的領域。最好的香水不是令人愉快的——它們是令人感興趣的。Serge Lutens 理解這一點。`],
    fr: [`Le sac est l'achat de luxe le plus complexe car il existe à l'intersection de la fonction, du statut et de l'esthétique — et la plupart des sacs échouent sur au moins l'un d'eux. Les grands sacs résolvent les trois : le Kelly d'Hermès, le Puzzle de Loewe, le tote bagage de Céline à l'époque de Phoebe Philo. Le parfum est le territoire le plus intime de la mode. Les meilleurs parfums ne sont pas agréables — ils sont intéressants. Serge Lutens le comprenait.`],
    it: [`La borsa è l'acquisto di lusso più complesso perché esiste all'intersezione di funzione, status ed estetica — e la maggior parte delle borse fallisce su almeno uno. Le grandi borse risolvono tutti e tre: il Kelly di Hermès, il Puzzle di Loewe, il tote bagaglio di Céline all'epoca di Phoebe Philo. Il profumo è il territorio più intimo della moda. I migliori profumi non sono piacevoli — sono interessanti. Serge Lutens lo capiva.`],
    es: [`El bolso es la compra de lujo más compleja porque existe en la intersección de función, estatus y estética — y la mayoría de los bolsos falla en al menos uno. Los grandes bolsos resuelven los tres: el Kelly de Hermès, el Puzzle de Loewe, el tote de equipaje de Céline en la época de Phoebe Philo. El perfume es el territorio más íntimo de la moda. Los mejores perfumes no son agradables — son interesantes. Serge Lutens lo entendía.`],
    answers: [
      "The bag is the most complex luxury purchase because it exists at the intersection of function, status, and aesthetics — and most bags fail on at least one. The genuinely great bags resolve all three: the Hermès Kelly, the Loewe Puzzle, the Phoebe Philo-era Céline luggage tote.",
      "Fragrance is fashion's most intimate territory. The best perfumes are not pleasant — they are interesting. Serge Lutens understood this. The current niche market is vast and uneven, but the interesting work is at small houses: Buly, Etat Libre d'Orange. Avoid anything that smells primarily of money.",
    ],
  },
  {
    keywords: ["couture", "haute couture", "ready to wear", "rtw", "bespoke", "made to measure", "artisanship"],
    zh: [`高級訂製是時裝最嚴苛同時也最戲劇性的形式。它創造出無法以其他方式存在的服裝：一件手工串珠香奈兒外套的重量，一個 Balenciaga 訂製袖子的建築精準度。這些不是服裝——它們是關於人體可以被要求穿什麼的論述。現在真正有趣的領域在高端成衣：The Row、Loro Piana、Brunello Cucinelli。Phoebe Philo 的同名品牌是這個空間中最被密切關注的實驗。`],
    fr: [`La haute couture est la forme la plus rigoureuse et la plus théâtrale de la mode simultanément. Ce qu'elle produit ne peut exister autrement : le poids d'une veste Chanel perlée à la main, la précision architecturale d'une manche couture Balenciaga. Ce ne sont pas des vêtements — ce sont des arguments sur ce que le corps humain peut être amené à porter. Le territoire intéressant est maintenant dans le prêt-à-porter haut de gamme : The Row, Loro Piana, Brunello Cucinelli.`],
    it: [`L'alta moda è la forma più rigorosa e più teatrale della moda contemporaneamente. Ciò che produce non può esistere altrimenti: il peso di una giacca Chanel con perle fatte a mano, la precisione architettonica di una manica couture Balenciaga. Questi non sono capi — sono argomenti su cosa il corpo umano può essere portato a indossare. Il territorio interessante ora è nell'alta gamma del prêt-à-porter: The Row, Loro Piana, Brunello Cucinelli.`],
    es: [`La alta costura es la forma más rigurosa y más teatral de la moda simultáneamente. Lo que produce no puede existir de otra manera: el peso de una chaqueta Chanel bordada a mano, la precisión arquitectónica de una manga couture de Balenciaga. No son prendas — son argumentos sobre qué puede pedírsele al cuerpo humano que vista. El territorio interesante ahora está en el extremo superior del prêt-à-porter: The Row, Loro Piana, Brunello Cucinelli.`],
    answers: [
      "Haute couture is fashion's most rigorous and most theatrical form simultaneously. What it produces is clothing that cannot exist otherwise: the weight of a hand-beaded Chanel jacket, the architectural precision of a Balenciaga couture sleeve. These are not garments, they are arguments about what the human body can be asked to wear.",
      "The interesting territory now is at the high end of ready-to-wear: The Row, Loro Piana, Brunello Cucinelli making clothing that approaches couture standards of material and construction. Phoebe Philo's eponymous label is the most closely watched experiment in this space — luxury, but not ceremony.",
    ],
  },

  {
    keywords: ["hermès", "hermes", "birkin", "kelly bag", "hermès scarf", "hermès silk", "orange box", "saddlery"],
    zh: [`Hermès 是最有紀律的奢侈品牌，因為它真的不需要你的渴望——它通過表現出對渴望的漠然來製造渴望。Birkin 不是被出售的；它是被分配的。那種對典型零售動態的顛覆，是這個品牌核心的戰略天才。Hermès 絲巾是應用設計的偉大成就之一：每條需要長達 18 個月從委託到生產，涉及數十位工匠，以 30-45 種色彩分色印製。`],
    fr: [`Hermès est la maison de luxe la plus disciplinée parce qu'elle n'a genuinement pas besoin de votre désir — elle fabrique le désir en paraissant indifférente à lui. Le Birkin n'est pas vendu ; il est alloué. Cette inversion de la dynamique de vente typique est le génie stratégique central de la maison. Le carré en soie Hermès est, après soixante ans de production, l'un des grands objets du design appliqué : chaque carré prend jusqu'à 18 mois, implique des dizaines d'artisans, et est imprimé avec 30 à 45 séparations de couleurs.`],
    it: [`Hermès è la maison di lusso più disciplinata perché genuinamente non ha bisogno del tuo desiderio — fabbrica il desiderio apparendo indifferente a esso. Il Birkin non viene venduto; viene assegnato. Questa inversione della dinamica di vendita tipica è il genio strategico centrale della maison. Il carré in seta Hermès è, dopo sessant'anni di produzione, uno dei grandi oggetti del design applicato: ogni sciarpa richiede fino a 18 mesi, coinvolge decine di artigiani, e viene stampata con 30-45 separazioni di colore.`],
    es: [`Hermès es la maison de lujo más disciplinada porque genuinamente no necesita tu deseo — fabrica el deseo al parecer indiferente a él. El Birkin no se vende; se asigna. Esa inversión de la dinámica de venta típica es el genio estratégico central de la maison. El carré de seda de Hermès es, tras sesenta años de producción, uno de los grandes objetos del diseño aplicado: cada pañuelo tarda hasta 18 meses, implica decenas de artesanos, y se imprime con 30-45 separaciones de color.`],
    answers: [
      "Hermès is the most disciplined luxury house because it genuinely doesn't need your desire — it manufactures desire by appearing indifferent to it. The Birkin is not sold; it is allocated. That inversion of the typical retail dynamic is the house's central strategic genius. The objects are excellent, but the psychology is impeccable.",
      "The Hermès silk carré is, after sixty years of production, still one of the great objects of applied design. Each scarf takes up to 18 months from commission to production, involves dozens of artisans, and is printed with 30–45 colour separations. The secondary market for them is substantial, and they hold value unusually well. As fashion objects go, they are unusually honest: they do exactly what they look like they do.",
    ],
  },
  {
    keywords: ["chanel", "karl lagerfeld", "coco chanel", "virginie viard", "chanel suit", "tweed", "no 5", "cc logo"],
    zh: [`Karl Lagerfeld 在香奈兒長達四十年的任期，是時裝史上最非凡的持續創意看管行動。他沒有保存香奈兒；他不斷地發明香奈兒可能意味著什麼，同時讓觀眾相信它一直都是如此。香奈兒目前正處於重大不確定性時刻——Virginie Viard 離職後，新創意總監的搜尋是奢侈時裝界最重要的懸案任命。`],
    fr: [`Le mandat de quarante ans de Karl Lagerfeld chez Chanel a été l'acte de gardiennage créatif soutenu le plus remarquable de l'histoire de la mode. Il n'a pas préservé Chanel ; il a continuellement inventé ce que Chanel pouvait signifier tout en faisant croire au public que cela avait toujours été ainsi. Chanel traverse actuellement un moment d'incertitude significative — la recherche d'un nouveau directeur créatif est la nomination la plus importante ouverte dans le luxe.`],
    it: [`Il mandato quarantennale di Karl Lagerfeld da Chanel è stato l'atto di tutela creativa sostenuta più straordinario nella storia della moda. Non ha preservato Chanel; ha continuamente inventato cosa Chanel potesse significare, facendo al contempo credere al pubblico che fosse sempre stato così. Chanel sta attraversando un momento di grande incertezza — la ricerca di un nuovo direttore creativo è la nomina più importante aperta nel lusso.`],
    es: [`El mandato de cuarenta años de Karl Lagerfeld en Chanel fue el acto más extraordinario de custodia creativa sostenida en la historia de la moda. No preservó Chanel; inventó continuamente lo que Chanel podría significar, haciendo al mismo tiempo creer al público que siempre había sido así. Chanel atraviesa actualmente un momento de gran incertidumbre — la búsqueda de un nuevo director creativo es el nombramiento más importante pendiente en el lujo.`],
    answers: [
      "Karl Lagerfeld's forty-year tenure at Chanel was the most remarkable act of sustained creative custodianship in fashion history. He did not preserve Chanel; he continuously invented what Chanel might mean while making audiences believe it had always meant that. The tension between Gabrielle Chanel's original codes — jersey, no corsetry, masculine references, simplicity — and Lagerfeld's baroque theatricality was generative rather than contradictory.",
      "Chanel is currently in a moment of significant uncertainty. Virginie Viard departed after five years, and the search for a new creative director is the most consequential open appointment in luxury fashion. The question is whether Chanel requires a guardian or an interrupter. Post-Lagerfeld, the temptation is reverence; but reverence killed other houses. Coco Chanel herself was not interested in preservation.",
    ],
  },
  {
    keywords: ["dior", "christian dior", "maria grazia chiuri", "dior saddle", "new look dior"],
    zh: [`Maria Grazia Chiuri 在 Dior 做了一件真正有趣的事：她要求 Dior 對自身美學的政治作出交代。女權主義文本、與非洲和南亞工藝女性的合作、對男性凝視的質疑——問題是真實的。Dior 的檔案極其豐富：Marc Bohan 的 Dior 被低估；John Galliano 的 Dior 是其時代最壯觀的時裝奇觀——關於奇觀是否服務於服裝的辯論至今仍未結束。`],
    fr: [`Maria Grazia Chiuri chez Dior fait quelque chose de genuinement intéressant : elle demande à Dior de rendre compte de la politique de sa propre beauté. Les textes féministes, les collaborations artisanales, la remise en question du regard masculin — les questions sont réelles. L'archive Dior est extraordinairement riche. Le Dior de Marc Bohan est sous-estimé; le Dior de John Galliano était le spectacle de mode le plus spectaculaire de son époque.`],
    it: [`Maria Grazia Chiuri da Dior sta facendo qualcosa di genuinamente interessante: chiede a Dior di rendere conto della politica della propria bellezza. I testi femministi, le collaborazioni artigianali, il questionare lo sguardo maschile — le domande sono reali. L'archivio Dior è straordinariamente ricco. Il Dior di Marc Bohan è sottovalutato; il Dior di John Galliano era lo spettacolo di moda più spettacolare della sua epoca.`],
    es: [`Maria Grazia Chiuri en Dior hace algo genuinamente interesante: pide a Dior que responda por la política de su propia belleza. Los textos feministas, las colaboraciones artesanales, el cuestionamiento de la mirada masculina — las preguntas son reales. El archivo de Dior es extraordinariamente rico. El Dior de Marc Bohan está infravalorado; el Dior de John Galliano fue el espectáculo de moda más espectacular de su época.`],
    answers: [
      "Maria Grazia Chiuri at Dior is doing something genuinely interesting: she is asking Dior to account for the politics of its own beauty. The feminist texts, the artisanal collaborations with African and South Asian craftswomen, the questioning of the male gaze — these aren't without contradiction, given the house's context, but the questions are real. Whether they produce great fashion is a separate matter from whether they are worth asking.",
      "The Dior archive is extraordinarily rich. Marc Bohan's Dior is underappreciated — his work from 1961 to 1989 maintained the house's commercial relevance through enormous social change with real intelligence. John Galliano's Dior, from 1997 to 2011, was the most spectacular fashion spectacle of its era: whether the spectacle served the clothes is still being debated.",
    ],
  },
  {
    keywords: ["prada", "miuccia prada", "miu miu", "prada nylon", "fondazione prada", "intellectual fashion", "ugly chic"],
    zh: [`Miuccia Prada 是過去三十年最重要的時裝頭腦，原因在於她在本質上無法創作出僅僅美麗的東西。她的本能始終是引入一種複雜性：一種醜陋、一種諷刺、一個智識問題。1984 年的尼龍雙肩包是奢侈品行業第一個真正概念性的物品。Miu Miu 是她無法在主線容納的想法的實驗室——最近的系列，極短裙擺、可見內衣、漫不經心的美學——是目前最具文化精準度的時裝表態之一。`],
    fr: [`Miuccia Prada est l'esprit de mode le plus important des trente dernières années, et la raison est qu'elle est constitutionnellement incapable de produire le simplement beau. Son instinct est toujours d'introduire une complication : une laideur, une ironie, un problème intellectuel. Le sac à dos en nylon de 1984 était le premier objet genuinement conceptuel de l'industrie du luxe. Miu Miu est son laboratoire d'idées.`],
    it: [`Miuccia Prada è la mente di moda più importante degli ultimi trent'anni, e il motivo è che è costituzionalmente incapace di produrre il semplicemente bello. Il suo istinto è sempre di introdurre una complicazione: una bruttezza, un'ironia, un problema intellettuale. Lo zaino in nylon del 1984 era il primo oggetto genuinamente concettuale dell'industria del lusso. Miu Miu è il suo laboratorio di idee.`],
    es: [`Miuccia Prada es la mente de moda más importante de los últimos treinta años, y la razón es que es constitucionalmente incapaz de producir lo meramente bello. Su instinto es siempre introducir una complicación: una fealdad, una ironía, un problema intelectual. El bolso de nylon de 1984 fue el primer objeto genuinamente conceptual de la industria del lujo. Miu Miu es su laboratorio de ideas.`],
    answers: [
      "Miuccia Prada is the most important fashion mind of the last thirty years, and the reason is that she is constitutionally incapable of producing the merely beautiful. Her instinct is always to introduce a complication: an ugliness, an irony, an intellectual problem. The nylon backpack of 1984 was the luxury industry's first genuinely conceptual object. Everything since has been a conversation.",
      "Miu Miu is Miuccia Prada's laboratory for ideas she cannot accommodate at the main house. Where Prada is architectural and intellectual, Miu Miu is impulsive and girlish, but with the same underlying irony. The recent Miu Miu collections — very short skirts, visible underpinnings, the aesthetics of carelessness — are among the most culturally precise fashion statements being made right now.",
    ],
  },
  {
    keywords: ["balenciaga", "cristobal balenciaga", "demna", "demna gvasalia", "balenciaga shoes", "balenciaga provocation"],
    zh: [`Cristóbal Balenciaga 是唯一一位得到 Coco Chanel 尊重的高訂師——這本身就說明了一些事情。他是最高超的技術師：他的袖子、他的後背、服裝與身體周圍空氣之間的關係。Pierre Cardin 和 Hubert de Givenchy 都曾在他門下受訓。Demna 的 Balenciaga 是截然不同的命題：今天最具政治和文化激進性的大型時裝品牌。那些挑釁不是錯誤——它們是偽裝成時裝的挑釁。`],
    fr: [`Cristóbal Balenciaga était le seul couturier que Coco Chanel respectait. Il était le technicien suprême : ses manches, ses dos, sa relation entre un vêtement et l'air autour du corps. Pierre Cardin et Hubert de Givenchy ont tous deux été formés sous lui. Le Balenciaga de Demna est une proposition entièrement différente : la maison de mode majeure la plus politiquement et culturellement agitée aujourd'hui. Les provocations ne sont pas des erreurs — ce sont des provocations déguisées en mode.`],
    it: [`Cristóbal Balenciaga era l'unico couturier che Coco Chanel rispettava. Era il supremo tecnico: le sue maniche, le sue spalle, il suo rapporto tra un capo e l'aria intorno al corpo. Pierre Cardin e Hubert de Givenchy si sono formati entrambi sotto di lui. Il Balenciaga di Demna è una proposta completamente diversa: la maison di moda più politicamente e culturalmente agitata oggi. Le provocazioni non sono errori — sono provocazioni travestite da moda.`],
    es: [`Cristóbal Balenciaga era el único couturier que Coco Chanel respetaba. Era el supremo técnico: sus mangas, sus espaldas, su relación entre una prenda y el aire alrededor del cuerpo. Pierre Cardin y Hubert de Givenchy se formaron ambos bajo él. El Balenciaga de Demna es una propuesta completamente diferente: la maison de moda más política y culturalmente agitada hoy. Las provocaciones no son errores — son provocaciones disfrazadas de moda.`],
    answers: [
      "Cristóbal Balenciaga was the only couturier Coco Chanel respected, and that tells you something. He was the supreme technician: his sleeves, his backs, his relationship between a garment and the air around the body. Pierre Cardin trained under him. Hubert de Givenchy trained under him. He is the couturier's couturier.",
      "Demna's Balenciaga is a completely different proposition: it is the most politically and culturally agitated major fashion house working today. The trash bag Birkin, the deliberate ugliness of certain footwear, the collaborations that question whether fashion is high or low — these are not mistakes. They are provocations dressed as fashion. The house is uncomfortable in ways the original house was also uncomfortable, though for very different reasons.",
    ],
  },
  {
    keywords: ["saint laurent", "ysl", "anthony vaccarello", "yves saint laurent", "le smoking"],
    zh: [`Anthony Vaccarello 在聖羅蘭創作出了罕見的東西：一種令人信服的延續而非中斷。他的聖羅蘭是誘人的、精確的，對時裝屋的性感氣息毫不畏懼。Yves Saint Laurent 改變了女性被允許穿著的界限——Mondrian 裙、獵裝、吸煙裝、透視上衣——每一件都是對現有社會規則的對抗，而每一件都贏了。`],
    fr: [`Anthony Vaccarello chez Saint Laurent a produit quelque chose de rare : une continuation convaincante plutôt qu'une interruption. Son Saint Laurent est séduisant, précis, et n'a pas peur de la charge sexuelle de la maison. Yves Saint Laurent a changé ce que les femmes étaient autorisées à porter — la robe Mondrian, la veste safari, le smoking, le chemisier transparent — chacun était une confrontation avec les règles sociales existantes, et chacun a gagné.`],
    it: [`Anthony Vaccarello da Saint Laurent ha prodotto qualcosa di raro: una continuazione convincente piuttosto che un'interruzione. Il suo Saint Laurent è seducente, preciso, e non teme la carica sessuale della maison. Yves Saint Laurent ha cambiato ciò che le donne erano autorizzate a indossare — il vestito Mondrian, la giacca safari, lo smoking, la blusa trasparente — ognuno era un confronto con le regole sociali esistenti, e ognuno ha vinto.`],
    es: [`Anthony Vaccarello en Saint Laurent ha producido algo raro: una continuación convincente en lugar de una interrupción. Su Saint Laurent es seductor, preciso, y no teme la carga sexual de la maison. Yves Saint Laurent cambió lo que las mujeres podían llevar — el vestido Mondrian, la chaqueta safari, el esmoquin, la blusa transparente — cada uno era una confrontación con las reglas sociales existentes, y cada uno ganó.`],
    answers: [
      "Anthony Vaccarello at Saint Laurent has produced something rare: a convincing continuation rather than an interruption. His Saint Laurent is seductive, precise, and unafraid of the house's sexual charge. The Rive Gauche spirit — liberated, Parisian, nocturnal — runs through it without nostalgia. He understands that Saint Laurent was primarily a feeling, and he makes clothes that produce that feeling.",
      "Yves Saint Laurent changed what women were allowed to wear. The Mondrian dress, the safari jacket, the tuxedo suit, the see-through blouse — each of these was a confrontation with existing social rules about women's bodies and dress, and each won. He took ideas from art, from Africa, from the street, and translated them into clothing that was both beautiful and genuinely radical.",
    ],
  },
  {
    keywords: ["the row", "olsen", "mary kate", "ashley olsen", "american quiet luxury", "american fashion"],
    zh: [`The Row 或許是過去二十年最重要的美國奢侈品牌，因為它拒絕了美國奢侈品情結——品牌化、名人效應、顯而易見的渴望。Mary-Kate 和 Ashley Olsen 建立的是一個關於克制本身如何成為品牌身份的案例研究——靜默傳達的聲音比噪音更大。衣服是傑出的：材料、工藝、比例。它們也極其昂貴，這不是巧合。`],
    fr: [`The Row est peut-être la marque de luxe américaine la plus significative des vingt dernières années parce qu'elle refuse le complexe du luxe américain — le branding, la célébrité, l'aspiration évidente. Ce que Mary-Kate et Ashley Olsen ont construit est une étude de cas sur la façon dont la retenue peut elle-même devenir une identité de marque — l'absence de bruit communique plus fort que le bruit. Les vêtements sont exceptionnels : les matières, la construction, la proportion.`],
    it: [`The Row è forse il brand di lusso americano più significativo degli ultimi vent'anni perché rifiuta il complesso del lusso americano — il branding, la celebrity, l'aspirazione ovvia. Quello che Mary-Kate e Ashley Olsen hanno costruito è un caso di studio su come la moderazione possa diventare essa stessa un'identità di brand — l'assenza di rumore comunica più forte del rumore. I capi sono eccezionali: i materiali, la costruzione, la proporzione.`],
    es: [`The Row es quizás la marca de lujo americana más significativa de los últimos veinte años porque rechaza el complejo de lujo americano — el branding, la celebridad, la aspiración obvia. Lo que Mary-Kate y Ashley Olsen construyeron es un caso de estudio sobre cómo la contención puede convertirse en una identidad de marca — la ausencia de ruido comunica más fuerte que el ruido. La ropa es excepcional: los materiales, la construcción, la proporción.`],
    answers: [
      "The Row is perhaps the most significant American luxury brand of the last two decades because it refuses the American luxury complex — the branding, the celebrity, the obvious aspiration. What Mary-Kate and Ashley Olsen built is a case study in how restraint can itself become a brand identity, where the absence of noise communicates louder than noise ever could. The clothes are exceptional: the materials, the construction, the proportion. They are also extremely expensive, which is not a coincidence.",
      "American fashion has produced relatively few luxury houses with genuine international authority. The Row is one. Proenza Schouler has real intelligence. Tom Ford had a period of producing fashion that was genuinely important. But the more interesting development is the quiet influence of American sportswear on global luxury — Donna Karan's body-conscious knits, the Ralph Lauren polo as sartorial democracy — which changed the DNA of casual dressing worldwide.",
    ],
  },
  {
    keywords: ["alaïa", "alaia", "azzedine alaia", "body conscious", "knit", "sculpting body"],
    zh: [`Azzedine Alaïa 與身體的關係是獨一無二的。他不是在給身體穿衣；他是在與身體合作。他的構造——螺旋形接縫、彈性面料、服裝與皮膚共同創造出雙方都無法單獨實現的效果——在技術上非常卓越。他也是唯一一位按照自己的日程而非行業日曆發布系列的大牌設計師。他只是拒絕被催促。`],
    fr: [`La relation d'Azzedine Alaïa avec le corps était unique. Il n'habillait pas le corps ; il collaborait avec lui. Ses constructions — les coutures en spirale, les tissus extensibles, la façon dont le vêtement et la peau créent ensemble quelque chose qu'aucun des deux ne pourrait créer seul — sont techniquement extraordinaires. Il était aussi le seul grand créateur à publier des collections selon son propre calendrier plutôt que le calendrier de l'industrie. Il refusait simplement d'être bousculé.`],
    it: [`Il rapporto di Azzedine Alaïa con il corpo era unico. Non vestiva il corpo; collaborava con esso. Le sue costruzioni — le cuciture a spirale, i tessuti elastici, il modo in cui capo e pelle creano insieme qualcosa che nessuno dei due potrebbe creare da solo — sono tecnicamente straordinarie. Era anche l'unico grande designer a pubblicare le sue collezioni secondo il proprio calendario piuttosto che quello dell'industria. Si rifiutava semplicemente di essere affrettato.`],
    es: [`La relación de Azzedine Alaïa con el cuerpo era única. No vestía el cuerpo; colaboraba con él. Sus construcciones — las costuras en espiral, las telas elásticas, la forma en que la prenda y la piel crean juntas algo que ninguna de las dos podría crear sola — son técnicamente extraordinarias. Era también el único gran diseñador en publicar sus colecciones según su propio calendario en lugar del de la industria. Simplemente se negaba a ser apresurado.`],
    answers: [
      "Azzedine Alaïa's relationship with the body was unlike any other designer's. He didn't dress the body; he collaborated with it. His constructions — the spiral seams, the stretch fabrics, the way the garment and skin create something neither could alone — are technically extraordinary. He was also the only major designer to release collections according to his own schedule rather than the industry calendar. He simply refused to be hurried.",
      "The Alaïa foundation in Paris has been preserving and exhibiting his work with great seriousness. The current house, under Pieter Mulier, is doing genuinely respectful work — building on the sculptural vocabulary without merely copying it. It is one of the more difficult inheritances in fashion.",
    ],
  },
  {
    keywords: ["jacquemus", "simon porte jacquemus", "mediterranean", "mini bag", "le chiquito", "provence"],
    zh: [`Simon Porte Jacquemus 是他這一代最具商業頭腦的設計師。他製作高度「可上鏡」的服裝——微型 Le Chiquito 包、極端比例、曬褪色的地中海色調——同時不犧牲真正的設計感，這是不尋常的。他的秀——薰衣草地、凡爾賽花園——是行銷天才，但也反映了對形象作為服裝延伸的真實理解。`],
    fr: [`Simon Porte Jacquemus est le créateur le plus commercialement astucieux de sa génération. Sa capacité à produire des vêtements très Instagrammables — le minuscule sac Le Chiquito, les proportions extrêmes, la palette méditerranéenne délavée — sans sacrifier une véritable sensibilité de design est inhabituelle. Ses défilés — le champ de lavande, le jardin de Versailles — sont du génie marketing qui reflète aussi une vraie compréhension de l'image comme extension du vêtement.`],
    it: [`Simon Porte Jacquemus è il designer commercialmente più astuto della sua generazione. La sua capacità di produrre abiti altamente Instagrammabili — la minuscola borsa Le Chiquito, le proporzioni estreme, la palette mediterranea sbiadita — senza sacrificare una genuina sensibilità di design è insolita. I suoi show — il campo di lavanda, il giardino di Versailles — sono un genio del marketing che riflette anche una vera comprensione dell'immagine come estensione dell'abbigliamento.`],
    es: [`Simon Porte Jacquemus es el diseñador comercialmente más astuto de su generación. Su capacidad para producir prendas altamente Instagrammeables — el diminuto bolso Le Chiquito, las proporciones extremas, la paleta mediterránea desteñida — sin sacrificar una genuina sensibilidad de diseño es inusual. Sus desfiles — el campo de lavanda, el jardín de Versalles — son un genio del marketing que también refleja una comprensión real de la imagen como extensión de la ropa.`],
    answers: [
      "Simon Porte Jacquemus is the most commercially astute designer of his generation. His ability to produce highly Instagrammable garments — the tiny Le Chiquito bag, the extreme proportions, the sun-bleached Mediterranean colour story — without sacrificing a genuine design sensibility is unusual. The fashion world is full of virality without vision. Jacquemus has managed to have both.",
      "What Jacquemus does that is underappreciated is that he produces clothes that are genuinely wearable. The exaggerated proportions, when worn correctly, do something interesting to the figure. They are not merely photographs. The shows — the lavender field, the Versailles garden — are marketing genius, but they also reflect a real understanding of image as extension of clothing.",
    ],
  },
  {
    keywords: ["tailoring", "suit", "bespoke", "savile row", "made to measure", "british tailoring", "sartorial"],
    zh: [`薩維爾街是世界上最嚴格的裁縫傳統，因為它始終主要是關於客戶而非設計師。一件 Huntsman 或 Anderson & Sheppard 的西裝不會宣告自己；它宣告的是你。剪裁通過多次試穿，根據你特定的姿態、動作和比例進行校準。你收到的不是一件衣服，而是你自己的翻譯。西裝是西方衣櫥中最重要的服裝——Anne Hollander 在《性愛與西裝》中的論述是正確的。`],
    fr: [`Savile Row est la tradition sartoriale la plus rigoureuse au monde parce qu'elle a toujours été avant tout une question de client plutôt que de créateur. Un costume Huntsman ou Anderson & Sheppard ne s'annonce pas ; il vous annonce. La coupe est calibrée selon votre posture, votre mouvement et vos proportions spécifiques à travers plusieurs essayages. Ce que vous recevez n'est pas un vêtement mais une traduction de vous-même.`],
    it: [`Savile Row è la tradizione sartoriale più rigorosa al mondo perché è sempre stata principalmente una questione di cliente piuttosto che di designer. Un abito Huntsman o Anderson & Sheppard non si annuncia; annuncia te. Il taglio è calibrato in base alla tua postura, al tuo movimento e alle tue proporzioni specifiche attraverso molteplici prove. Quello che ricevi non è un capo ma una traduzione di te stesso.`],
    es: [`Savile Row es la tradición sartorial más rigurosa del mundo porque siempre ha sido principalmente sobre el cliente más que sobre el diseñador. Un traje de Huntsman o Anderson & Sheppard no se anuncia a sí mismo; te anuncia a ti. El corte se calibra según tu postura, movimiento y proporciones específicas a través de múltiples pruebas. Lo que recibes no es una prenda sino una traducción de ti mismo.`],
    answers: [
      "Savile Row is the most rigorous sartorial tradition in the world because it has always been primarily about the client rather than the designer. A Huntsman suit or an Anderson & Sheppard suit does not announce itself; it announces you. The cut is calibrated to your specific posture, movement, and proportions over multiple fittings. What you receive is not a garment but a translation of yourself.",
      "The suit is the most important garment in the Western wardrobe, and Anne Hollander's argument in Sex and Suits is correct: it has been continuously refined over five centuries because it solves a genuine problem — how to make the male body look purposeful, proportionate, and authoritative simultaneously. The contemporary move to softer construction and unstructured shoulders is interesting because it questions what 'purposeful' means now.",
    ],
  },
  {
    keywords: ["fashion education", "fashion school", "central saint martins", "parsons", "royal college", "fit", "fashion student", "study fashion"],
    zh: [`倫敦中央聖馬丁藝術與設計學院是過去四十年最具生產力的時裝學校，遠超其他：Alexander McQueen、John Galliano、Stella McCartney、Hussein Chalayan——名單令人驚嘆。CSM 培養的是有觀點的設計師，這比技術更難教授。值得了解的學校：中央聖馬丁（概念創意）；ESMOD 和 IFM 巴黎（技術嚴謹）；Parsons 和 FIT 紐約（商業智慧）；倫敦皇家藝術學院（研究生研究）。`],
    fr: [`Central Saint Martins à Londres est l'école de mode la plus productive des quarante dernières années, de loin : Alexander McQueen, John Galliano, Stella McCartney, Hussein Chalayan — la liste est extraordinaire. Ce que CSM produit, ce sont des créateurs avec un point de vue. Les écoles à connaître : Central Saint Martins (London) pour le conceptuel ; ESMOD et IFM (Paris) pour la rigueur technique ; Parsons et FIT (New York) pour l'intelligence commerciale.`],
    it: [`Central Saint Martins a Londra è la scuola di moda più generativa degli ultimi quarant'anni, di gran lunga: Alexander McQueen, John Galliano, Stella McCartney, Hussein Chalayan — la lista è straordinaria. Ciò che CSM produce sono designer con un punto di vista. Le scuole da conoscere: Central Saint Martins (Londra) per il concettuale; ESMOD e IFM (Parigi) per il rigore tecnico; Parsons e FIT (New York) per l'intelligenza commerciale.`],
    es: [`Central Saint Martins en Londres es la escuela de moda más productiva de los últimos cuarenta años, con diferencia: Alexander McQueen, John Galliano, Stella McCartney, Hussein Chalayan — la lista es extraordinaria. Lo que CSM produce son diseñadores con un punto de vista. Las escuelas a conocer: Central Saint Martins (Londres) para lo conceptual; ESMOD e IFM (París) para el rigor técnico; Parsons y FIT (Nueva York) para la inteligencia comercial.`],
    answers: [
      "Central Saint Martins in London is the most generative fashion school of the last forty years by a considerable margin. Alexander McQueen, John Galliano, Stella McCartney, Hussein Chalayan, Riccardo Tisci — the list is extraordinary. What CSM produces is designers with a point of view, which is harder to teach than technique. The atmosphere is deliberately uncomfortable; ideas are stressed until they break or become something.",
      "The fashion schools worth knowing: Central Saint Martins (London) for conceptual edge; ESMOD and IFM (Paris) for technical rigour; Parsons and FIT (New York) for commercial intelligence; RCA (London) for graduate-level research. The best fashion education is often found in the margins — in theatre, in architecture, in fine art. Yves Saint Laurent trained under Dior. Rei Kawakubo is entirely self-taught. The field doesn't require credentials, only genuine knowledge.",
    ],
  },
  {
    keywords: ["fabric", "textile", "cashmere", "silk", "linen", "wool", "cotton", "material", "cloth", "weave"],
    zh: [`喀什米爾品質差異極大，奢侈品市場的高端已被大量低品質喀什米爾所削弱。你需要的是來自蒙古或喀什米爾山羊腹部的長纖維喀什米爾，以克制的方式紡紗和編織。Loro Piana 的喀什米爾是基準；Brunello Cucinelli 的也是例外。最被低估的面料可能是亞麻：它起皺，這使它誠實——它展示了它被穿過的痕跡，並以大多數面料做不到的方式隨年月改善。`],
    fr: [`La qualité du cachemire varie énormément et le marché du luxe a été affaibli par la prolifération de cachemire de basse qualité. Ce que vous voulez, c'est du cachemire à longues fibres de Mongolie ou du Cachemire, filé et tissé avec retenue. Le cachemire de Loro Piana est la référence. Le tissu le plus sous-estimé est probablement le lin — il se froisse, ce qui le rend honnête : il montre qu'il a été porté, et s'améliore avec l'âge d'une façon que la plupart des tissus ne font pas.`],
    it: [`La qualità del cashmere varia enormemente e il mercato del lusso è stato indebolito dalla proliferazione di cashmere di bassa qualità. Quello che si vuole è cashmere a fibra lunga dalla Mongolia o dal Kashmir, filato e tessuto con moderazione. Il cashmere di Loro Piana è il punto di riferimento. Il tessuto più sottovalutato è probabilmente il lino — si sgualcisce, il che lo rende onesto: mostra di essere stato indossato, e migliora con gli anni in un modo che la maggior parte dei tessuti non fa.`],
    es: [`La calidad del cachemira varía enormemente y el mercado del lujo se ha debilitado por la proliferación de cachemira de baja calidad. Lo que se busca es cachemira de fibra larga de Mongolia o Cachemira, hilado y tejido con moderación. El cachemira de Loro Piana es el referente. La tela más infravalorada es probablemente el lino — se arruga, lo que lo hace honesto: muestra que se ha llevado, y mejora con los años de una manera que la mayoría de las telas no hacen.`],
    answers: [
      "Cashmere quality varies enormously and the luxury end of the market has been weakened by the proliferation of low-grade cashmere at artificially low prices. What you want is long-fibre cashmere from the underbelly of Mongolian or Kashmiri goats, spun and woven with restraint. Loro Piana's cashmere is the benchmark. Brunello Cucinelli's is also exceptional. If it pills immediately, it is not good cashmere.",
      "The most underappreciated fabric in fashion is probably linen. It wrinkles, which makes it honest: it shows you it's been worn. It breathes intelligently. It improves with age and washing in a way most fabrics don't. The snobbery against its creasing is a snobbery against natural materials behaving naturally, which is, frankly, a category error.",
    ],
  },
  {
    keywords: ["fashion photography", "helmut newton", "avedon", "nick knight", "steven meisel", "photographer", "editorial photography"],
    zh: [`Helmut Newton 通過將真正的威脅感引入一個以魅力為主的空間，改變了時裝攝影。他的女性不是渴望的對象；她們擁有渴望。他 1970 年代為 Vogue Paris 拍攝的作品，是時裝所產生的最非凡的對象之一。Nick Knight 是過去三十年形式上最具創造力的時裝攝影師——他的 SHOWstudio 平台基本上發明了時裝電影這一媒介。`],
    fr: [`Helmut Newton a changé la photographie de mode en introduisant une vraie menace dans un espace consacré au charme. Ses femmes n'étaient pas des objets de désir ; elles possédaient le désir. Ses photographies des années 1970 pour Vogue Paris sont parmi les objets les plus remarquables que la mode ait produits. Nick Knight est le photographe de mode formellement le plus inventif des trente dernières années — sa plateforme SHOWstudio a essentiellement inventé le film de mode comme médium.`],
    it: [`Helmut Newton ha cambiato la fotografia di moda introducendo una vera minaccia in uno spazio dedicato al fascino. Le sue donne non erano oggetti di desiderio; possedevano il desiderio. Le sue fotografie degli anni '70 per Vogue Paris sono tra gli oggetti più straordinari che la moda abbia prodotto. Nick Knight è il fotografo di moda formalmente più inventivo degli ultimi trent'anni — la sua piattaforma SHOWstudio ha essenzialmente inventato il film di moda come medium.`],
    es: [`Helmut Newton cambió la fotografía de moda introduciendo una verdadera amenaza en un espacio dedicado principalmente al encanto. Sus mujeres no eran objetos de deseo; poseían el deseo. Sus fotografías de los años 70 para Vogue Paris son algunos de los objetos más extraordinarios que la moda ha producido. Nick Knight es el fotógrafo de moda formalmente más inventivo de los últimos treinta años — su plataforma SHOWstudio inventó esencialmente el cine de moda como medio.`],
    answers: [
      "Helmut Newton changed fashion photography by introducing genuine menace into a space that had been largely devoted to charm. His women were not objects of desire; they possessed desire. His photographs from the 1970s Vogue Paris shoots are among the most remarkable objects fashion has produced.",
      "Nick Knight is the most formally inventive fashion photographer of the last thirty years. His understanding of image as constructed rather than captured — the use of texture, post-production, collaborative chemistry with designers — produced a completely new visual language for fashion. His SHOWstudio platform essentially invented fashion film as a medium.",
    ],
  },
  {
    keywords: ["fashion week", "paris fashion week", "milan fashion week", "london fashion week", "new york fashion week", "show", "runway show", "presentation"],
    zh: [`巴黎依然是時裝日曆的頂點，因為那裡的才華、投資和文化分量的集中是無與倫比的。倫敦是最具生成性實驗性的——中央聖馬丁的效應意味著新興設計師場景具有真正的智識能量。米蘭是技術上最精湛、商業上最嚴肅的。紐約目前正在尋找方向，儘管其運動服裝智慧對全球時裝的貢獻是被低估的。`],
    fr: [`Paris reste l'apex du calendrier de la mode parce que la concentration de talents, d'investissement et de poids culturel y est inégalée. Londres est le plus génératif expérimentalement — l'effet Central Saint Martins signifie que la scène des créateurs émergents a une vraie énergie intellectuelle. Milan est le plus accompli techniquement et le plus sérieux commercialement. New York cherche actuellement sa direction.`],
    it: [`Parigi rimane l'apice del calendario della moda perché la concentrazione di talento, investimento e peso culturale è senza pari. Londra è la più generativamente sperimentale — l'effetto Central Saint Martins significa che la scena dei designer emergenti ha una vera energia intellettuale. Milano è la più tecnicamente compiuta e commercialmente seria. New York sta attualmente cercando una direzione.`],
    es: [`París sigue siendo el ápice del calendario de la moda porque la concentración de talento, inversión y peso cultural es incomparable. Londres es la más generativamente experimental — el efecto Central Saint Martins significa que la escena de diseñadores emergentes tiene una verdadera energía intelectual. Milán es la más técnicamente lograda y comercialmente seria. Nueva York está buscando actualmente su dirección.`],
    answers: [
      "Paris remains the apex of the fashion calendar because the concentration of talent, investment, and cultural weight is unmatched. London is the most generatively experimental — the Central Saint Martins effect means the emerging designer scene has genuine intellectual energy. Milan is the most technically accomplished and commercially serious. New York is currently searching, though its sportswear intelligence is an undervalued contribution to global fashion.",
      "The fashion show as a form is under interesting pressure. The digital show, the static presentation, the film — these alternatives emerged during the pandemic and some persist. But the best runway shows are still irreplaceable: the experience of sitting in a room while clothes move through space, understanding proportion, weight, and volume in real time, is not replicable on a screen.",
    ],
  },
  {
    keywords: ["luxury market", "lvmh", "kering", "richemont", "luxury group", "fashion business", "fashion industry economics"],
    zh: [`LVMH 是全球最大的奢侈品集團，旗下擁有路易威登、迪奧、紀梵希、芬迪、羅意威、思琳，以及大約七十個其他品牌。Bernard Arnault 的天才在於理解奢侈品品牌是文化而非純粹物質的命題——你可以在不必然擴大文化的情況下擴大運營。Kering 旗下擁有古馳、Bottega Veneta、巴黎世家、聖羅蘭，過去十年比 LVMH 更為動蕩。`],
    fr: [`LVMH est le plus grand groupe de luxe au monde, abritant Louis Vuitton, Dior, Givenchy, Fendi, Loewe, Céline et environ soixante-dix autres marques. Le génie de Bernard Arnault a été de comprendre que les marques de luxe sont des propositions culturelles plutôt que purement matérielles. Kering abrite Gucci, Bottega Veneta, Balenciaga, Saint Laurent et a connu une décennie plus volatile que LVMH.`],
    it: [`LVMH è il più grande gruppo del lusso al mondo, ospitando Louis Vuitton, Dior, Givenchy, Fendi, Loewe, Céline e circa settanta altri brand. Il genio di Bernard Arnault è stato capire che i brand di lusso sono proposte culturali piuttosto che puramente materiali. Kering ospita Gucci, Bottega Veneta, Balenciaga, Saint Laurent e ha avuto un decennio più volatile di LVMH.`],
    es: [`LVMH es el grupo de lujo más grande del mundo, albergando Louis Vuitton, Dior, Givenchy, Fendi, Loewe, Céline y aproximadamente setenta otras marcas. El genio de Bernard Arnault fue entender que las marcas de lujo son propuestas culturales más que puramente materiales. Kering alberga Gucci, Bottega Veneta, Balenciaga, Saint Laurent y ha tenido una década más volátil que LVMH.`],
    answers: [
      "LVMH is the world's largest luxury group, housing Louis Vuitton, Dior, Givenchy, Fendi, Loewe, Celine, and roughly seventy other brands. It is, fundamentally, a luxury conglomerate that has used brand acquisition and operational efficiency to turn fashion into a highly defensible business. Bernard Arnault's genius was understanding that luxury brands are cultural rather than purely material propositions — you can scale operations without necessarily scaling the culture.",
      "Kering houses Gucci, Bottega Veneta, Balenciaga, Saint Laurent, and Brioni, among others. It has had a more volatile decade than LVMH — the post-Michele Gucci recalibration has been expensive. Richemont focuses primarily on hard luxury: Cartier, IWC, Jaeger-LeCoultre. The difference in margin profile between soft luxury (fashion) and hard luxury (watches, jewellery) is significant.",
    ],
  },
  {
    keywords: ["men's fashion", "menswear", "men's style", "men's suit", "men's clothing", "dress code"],
    zh: [`男裝正在經歷幾代以來最有趣的十年。正式著裝規範的瓦解，創造了一個關於男性穿著目的的真實問題，答案正在多個方向同時出現：Thom Browne 的極端剪裁；Loewe 的優雅運動服；Brunello Cucinelli 的重新詮釋經典；Lemaire 的解構形式主義。穿得好的基本原則：穿合身的衣服，以配得上其價格的布料製成，並對此有自己的見解。`],
    fr: [`La mode masculine connaît sa décennie la plus intéressante depuis des générations. L'effondrement des codes vestimentaires formels a créé une vraie question sur la raison d'être de l'habillement masculin, et les réponses émergent dans plusieurs directions : la taillerie extrême de Thom Browne, le sportswear élégant de Loewe, les classiques réinterprétés de Brunello Cucinelli, le formalisme déstructuré de Lemaire. Le principe fondamental : portez ce qui vous va, dans du tissu qui vaut son prix, et ayez une opinion là-dessus.`],
    it: [`Il menswear sta vivendo il decennio più interessante da generazioni. Il crollo dei codici di abbigliamento formali ha creato una vera domanda su cosa sia il vestirsi maschile, e le risposte emergono in diverse direzioni: la sartoria estrema di Thom Browne, lo sportswear elegante di Loewe, i classici reinterpretati di Brunello Cucinelli, il formalismo destrutturato di Lemaire. Il principio fondamentale: indossate ciò che vi sta bene, in un tessuto che vale il suo prezzo, e abbiate un'opinione a riguardo.`],
    es: [`La moda masculina vive su década más interesante desde generaciones. El colapso de los códigos de vestimenta formales ha creado una pregunta real sobre para qué sirve el vestirse masculino, y las respuestas emergen en varias direcciones: la sastrería extrema de Thom Browne, el sportswear elegante de Loewe, los clásicos reinterpretados de Brunello Cucinelli, el formalismo desestructurado de Lemaire. El principio fundamental: viste lo que te queda bien, en tela que vale su precio, y ten una opinión al respecto.`],
    answers: [
      "Menswear is having its most interesting decade in generations. The collapse of formal dress codes created a genuine question about what men's dressing is for, and the answers are now emerging in several directions simultaneously: extreme tailoring from Thom Browne; elegant sportswear from Loewe; the reimagined classics of Brunello Cucinelli; the deconstructed formalism of Lemaire.",
      "The foundational principle of dressing well as a man is the same as it is for everyone: wear what fits, in cloth that's worth the price, and have an opinion about it. The specific menswear version of this: invest in shoes, invest in a coat, and don't confuse premium with expensive.",
    ],
  },
  {
    keywords: ["fashion and art", "art collaboration", "fashion museum", "fashion exhibition", "designer as artist", "wearable art"],
    zh: [`時裝與純藝術之間的關係真的很複雜，時裝界往往在這個領域高估了自己的精密程度。真正的合作發生在雙方都不只是裝飾對方的時候。Fondazione Prada 是一個嚴肅的藝術機構；Miuccia Prada 對藝術的興趣不是公關。最好的時裝展覽理解衣服不是繪畫——倫敦的 V&A 博物館在時裝策展方面始終是最智識性的。`],
    fr: [`La relation entre la mode et les beaux-arts est genuinement compliquée, et le monde de la mode surestime souvent sa propre sophistication dans ce domaine. La vraie collaboration se produit quand aucune des deux parties ne se contente de décorer l'autre. La Fondazione Prada est une institution d'art sérieuse. Les meilleures expositions de mode comprennent que les vêtements ne sont pas des tableaux — le V&A à Londres a produit la curation de mode la plus intelligente.`],
    it: [`Il rapporto tra moda e belle arti è genuinamente complicato, e il mondo della moda spesso sopravvaluta la propria sofisticazione in questo territorio. La vera collaborazione avviene quando nessuna delle due parti si limita a decorare l'altra. La Fondazione Prada è una seria istituzione d'arte. Le migliori mostre di moda capiscono che i vestiti non sono dipinti — il V&A a Londra ha prodotto la curatela di moda più intelligente.`],
    es: [`La relación entre la moda y las bellas artes es genuinamente complicada, y el mundo de la moda a menudo sobreestima su propia sofisticación en este territorio. La verdadera colaboración ocurre cuando ninguna de las dos partes se limita a decorar a la otra. La Fondazione Prada es una institución de arte seria. Las mejores exposiciones de moda entienden que la ropa no son cuadros — el V&A en Londres ha producido la curaduría de moda más inteligente.`],
    answers: [
      "The relationship between fashion and fine art is genuinely complicated, and the fashion world often overstates its own sophistication in this territory. Real collaboration happens when neither party merely decorates the other. The Fondazione Prada is a serious art institution; Miuccia Prada's interest in art is not PR. Loewe's Craft Prize is thoughtful. Hermès's relationship with contemporary artists through the carré commissions is long-standing and serious.",
      "The best fashion exhibitions understand that clothes are not paintings. The V&A in London has produced consistently the most intelligent fashion curation — understanding that a garment needs to be seen in relation to the body it was made for, and in relation to the cultural moment it came from.",
    ],
  },

  // ── COTERIE PLATFORM ───────────────────────────────────────────────────────

  {
    keywords: ["what is coterie", "what's coterie", "about coterie", "explain coterie", "how does coterie work", "what is this app", "什麼是coterie", "coterie是什麼", "關於coterie", "平台介紹", "這個app", "qu'est-ce que coterie", "cos'è coterie", "qué es coterie"],
    zh: [
      `Coterie 是一個嚴選的會員制私人網絡，專為奢侈時裝行業的頂尖創意人才而設。它不是一個社交媒體平台，也不是一個招聘網站。它是一個引薦網絡——會員與品牌、編輯機構及同業之間建立聯繫的場所，這些聯繫由 Coterie 的禮賓團隊親自促成。

加入需要申請並通過審核。您目前持有精英會員資格——這是最高的會籍層級。`,
    ],
    fr: [
      "Coterie est un réseau privé sélectif réservé aux professionnels créatifs d'élite de la mode de luxe. Ce n'est pas un réseau social, ni un site d'emploi. C'est un réseau d'introductions — un lieu où les membres se connectent avec des marques, des éditeurs et des pairs, ces connexions étant facilitées personnellement par l'équipe de conciergerie de Coterie.",
    ],
    it: [
      "Coterie è una rete privata selettiva riservata ai professionisti creativi d'élite della moda di lusso. Non è un social media, né un sito di lavoro. È una rete di introduzioni — un luogo dove i membri si connettono con brand, editori e colleghi, facilitati dal team di concierge di Coterie.",
    ],
    es: [
      "Coterie es una red privada selectiva para los profesionales creativos de élite de la moda de lujo. No es una red social, ni un sitio de empleo. Es una red de presentaciones — un lugar donde los miembros se conectan con marcas, editores y colegas, facilitado por el equipo de conserjería de Coterie.",
    ],
    answers: [
      "Coterie is a private professional network exclusively for luxury fashion creatives. Every member is personally vetted. The network connects stylists, creative directors, casting directors, art directors, PRs, and brand-side talent through curated introductions, exclusive roles, and private events. You can only join by applying or being referred by an existing member.",
    ],
  },
  {
    keywords: ["membership", "tier", "professional", "elite", "plan", "upgrade", "benefits", "perks"],
    zh: [`Coterie 有兩個會員層級。專業級提供精選職位、每月最多 5 次引薦以及標準活動邀請。精英級——您目前的層級——提供無限引薦、提前 48 小時優先訪問職位、品牌搜索中的優先排名、所有僅限會員活動的訪問權限，以及專屬會員管理員。`],
    fr: [`Coterie a deux niveaux d'adhésion. Professional vous donne des rôles sélectionnés, jusqu'à 5 introductions par mois, et des invitations aux événements standards. Elite — votre niveau actuel — vous donne des introductions illimitées, un premier accès aux rôles 48 heures en avance, une priorité dans les recherches de marques, l'accès à tous les événements réservés aux membres, et un gestionnaire d'adhésion dédié.`],
    it: [`Coterie ha due livelli di membership. Professional ti dà ruoli selezionati, fino a 5 introduzioni al mese, e inviti agli eventi standard. Elite — il tuo livello attuale — ti dà introduzioni illimitate, primo accesso ai ruoli 48 ore prima, posizionamento prioritario nelle ricerche del brand, accesso a tutti gli eventi riservati ai membri, e un manager di membership dedicato.`],
    es: [`Coterie tiene dos niveles de membresía. Professional te da roles seleccionados, hasta 5 presentaciones al mes, e invitaciones a eventos estándar. Elite — tu nivel actual — te da presentaciones ilimitadas, primer acceso a roles 48 horas antes, colocación prioritaria en búsquedas de marcas, acceso a todos los eventos exclusivos para miembros, y un gestor de membresía dedicado.`],
    answers: [
      "Coterie has two membership tiers. Professional gives you curated roles, up to 5 introductions per month, and standard event invitations. Elite — your current tier — gives you unlimited introductions, first access to roles 48 hours early, priority placement in brand searches, access to all members-only events, and a dedicated membership manager.",
    ],
  },
  {
    keywords: ["apply", "join", "membership application", "how do i get in", "sign up", "register", "new member", "referral"],
    zh: [`會員申請由我們的委員會親自審查。您可以從登入界面使用「申請會員資格」按鈕直接申請。我們在 5-7 個工作日內審查每份申請，優先考慮有記錄的奢侈時裝行業經驗的申請者。`],
    fr: [`Les candidatures d'adhésion sont examinées personnellement par notre comité. Vous pouvez postuler directement depuis l'écran de connexion en utilisant le bouton Postuler pour l'adhésion. Nous examinons chaque candidature dans les 5 à 7 jours ouvrables et donnons la priorité aux candidats ayant une expérience documentée dans la mode de luxe.`],
    it: [`Le domande di membership sono esaminate personalmente dal nostro comitato. Puoi candidarti direttamente dalla schermata di accesso usando il pulsante Candidati per la Membership. Esaminiamo ogni candidatura entro 5-7 giorni lavorativi e diamo priorità ai candidati con esperienza documentata nella moda di lusso.`],
    es: [`Las solicitudes de membresía son revisadas personalmente por nuestro comité. Puedes solicitar directamente desde la pantalla de inicio de sesión usando el botón Solicitar Membresía. Revisamos cada solicitud en 5-7 días hábiles y damos prioridad a los solicitantes con experiencia documentada en moda de lujo.`],
    answers: [
      "Membership applications are reviewed personally by our committee. You can apply directly from the sign-in screen using the Apply for Membership button. We review every application within 5–7 business days. We prioritise applicants with documented luxury fashion experience.",
    ],
  },
  {
    keywords: ["introduction", "intro", "connect", "meet", "who to meet", "network", "request", "facilitat", "引薦", "引薦如何", "如何引薦", "人脈", "認識", "連接", "申請", "介紹", "introduction coterie", "présentation", "introduzione", "presentación"],
    zh: [
      `引薦是 Coterie 的核心機制。當您在引薦頁面請求引薦時，我們的團隊會聯繫雙方並促成介紹——前提是另一方有意願且時間允許。這是一個有溫度的過程，而非算法配對。

您目前有三個待處理引薦：Sofia Andreou（Loewe 人才總監）、James Harrington（Burberry 創意總監）及 Claire Beaumont（Valentino 選角總監）。向右滑動接受，向左拒絕。`,
    ],
    fr: [
      `Les introductions sont le mécanisme central de Coterie. Lorsque vous demandez une introduction, notre équipe contacte les deux parties — à condition que l'autre partie soit disponible et intéressée. C'est un processus humain, pas un algorithme.

Vous avez actuellement trois introductions en attente : Sofia Andreou (Directrice des Talents, Loewe), James Harrington (Directeur Créatif, Burberry) et Claire Beaumont (Directrice de Casting, Valentino). Glissez à droite pour accepter, à gauche pour refuser.`,
    ],
    it: [
      `Le introduzioni sono il meccanismo centrale di Coterie. Quando richiedi un'introduzione, il nostro team contatta entrambe le parti — a condizione che l'altra parte sia disponibile e interessata.

Hai attualmente tre introduzioni in sospeso: Sofia Andreou (Head of Talent, Loewe), James Harrington (Creative Director, Burberry) e Claire Beaumont (Casting Director, Valentino). Scorri a destra per accettare, a sinistra per rifiutare.`,
    ],
    es: [
      `Las presentaciones son el mecanismo central de Coterie. Cuando solicitas una presentación, nuestro equipo contacta a ambas partes — siempre que la otra parte esté disponible e interesada.

Actualmente tienes tres presentaciones pendientes: Sofia Andreou (Directora de Talento, Loewe), James Harrington (Director Creativo, Burberry) y Claire Beaumont (Directora de Casting, Valentino). Desliza a la derecha para aceptar, a la izquierda para rechazar.`,
    ],
    answers: [
      "Introductions are the heart of Coterie. From the Intros tab, tap Request and provide the person's name, their brand, and a brief context note. Our team facilitates every introduction personally. You can swipe right to accept or left to decline introductions made to you.",
      "Your Intros tab shows pending introductions awaiting your response, plus your full history. You have three pending right now — Sofia Andreou at Loewe, James Harrington at Burberry, and Claire Beaumont at Valentino.",
    ],
  },
  {
    keywords: ["role", "job", "position", "opportunity", "vacancy", "matched", "express interest", "briefcase", "hire", "職位", "工作", "機會", "應徵", "職缺", "匹配職位", "表達意向", "poste", "emploi", "opportunité", "ruolo", "lavoro", "rol", "empleo", "oportunidad"],
    zh: [
      `職位頁面顯示為您精選的配對機會。每個職位均由 Coterie 編輯團隊審核，確保與您的背景和資歷相符。

點擊「表達意向」即可通知品牌您有興趣——品牌方將在確認有潛在配對後與您聯繫。儲存職位可隨時在「已儲存」篩選器中找到。`,
    ],
    fr: [
      `L'onglet Postes affiche des opportunités sélectionnées et correspondantes pour vous. Chaque poste est examiné par l'équipe éditoriale de Coterie pour s'assurer qu'il correspond à votre profil.

Appuyez sur 'Manifester l'intérêt' pour informer la marque de votre intérêt — elle vous contactera si une correspondance est confirmée.`,
    ],
    it: [
      `La scheda Ruoli mostra opportunità selezionate e corrispondenti per te. Ogni ruolo è esaminato dal team editoriale di Coterie per assicurarsi che corrisponda al tuo profilo.

Tocca 'Esprimi interesse' per informare il brand del tuo interesse — ti contatterà se viene confermata una corrispondenza.`,
    ],
    es: [
      `La pestaña Roles muestra oportunidades seleccionadas y compatibles para ti. Cada rol es revisado por el equipo editorial de Coterie para asegurarse de que coincida con tu perfil.

Toca 'Expresar interés' para informar a la marca de tu interés — te contactará si se confirma una compatibilidad.`,
    ],
    answers: [
      "The Roles tab shows curated opportunities matched to your profile — Editorial, Brand, Production, Communications, and Creative roles, all UK-based. Tap any role to see the full brief and express interest. As Elite, you see new roles 48 hours before other members.",
      "Your current strong matches: Fashion Director at Vogue UK (£120,000–£160,000), Senior Stylist at Burberry (£800–£1,100/day), Art Director at Another Magazine (£70,000–£90,000). Tap any role card to read the full brief and express interest.",
    ],
  },
  {
    keywords: ["event", "events", "dinner", "gathering", "attend", "rsvp", "invite", "calendar"],
    zh: [`活動選項卡顯示即將到來的 Coterie 聚會——私人晚宴、工作室參訪、品牌展示以及與主要時裝屋創意負責人的非公開對話。作為精英會員，您有資格參加所有活動。名額有限；請儘早確認出席。`],
    fr: [`L'onglet Événements affiche les prochains rassemblements Coterie — dîners privés, visites de studios, présentations de marques et conversations privées avec la direction créative des grandes maisons. En tant qu'Élite, vous avez accès à tous les événements. Les places sont limitées ; confirmez tôt.`],
    it: [`La scheda Eventi mostra i prossimi incontri Coterie — cene private, visite in studio, presentazioni di brand e conversazioni riservate con la leadership creativa delle grandi maison. Come Elite, hai accesso a tutti gli eventi. I posti sono limitati; rispondi presto.`],
    es: [`La pestaña Eventos muestra los próximos encuentros de Coterie — cenas privadas, visitas a estudios, presentaciones de marcas y conversaciones reservadas con el liderazgo creativo de las grandes maisons. Como Elite, tienes acceso a todos los eventos. Los cupos son limitados; confirma pronto.`],
    answers: [
      "The Events tab shows upcoming Coterie gatherings — private dinners, studio visits, brand presentations, and off-record conversations with creative leadership at major houses. As Elite, you have access to all events. Spots are limited; RSVP early.",
    ],
  },
  {
    keywords: ["profile", "portfolio", "credits", "edit profile", "bio", "photo", "picture", "avatar", "my profile"],
    zh: [`您的個人資料是您的 Coterie 名片——品牌和會員在搜索網絡時看到的內容。在個人資料選項卡上：直接編輯您的姓名、職稱和簡介。使用 + 按鈕添加工作記錄。點擊頭像更新您的照片。`],
    fr: [`Votre profil est votre carte de visite Coterie — ce que les marques et les membres voient lorsqu'ils recherchent dans le réseau. Dans l'onglet Profil : modifiez directement votre nom, votre titre et votre biographie. Ajoutez des crédits avec le bouton +. Mettez à jour votre photo en appuyant sur l'avatar.`],
    it: [`Il tuo profilo è il tuo biglietto da visita Coterie — ciò che brand e membri vedono quando cercano nella rete. Nella scheda Profilo: modifica direttamente il tuo nome, titolo e biografia. Aggiungi crediti con il pulsante +. Aggiorna la tua foto toccando l'avatar.`],
    es: [`Tu perfil es tu tarjeta de presentación en Coterie — lo que marcas y miembros ven cuando buscan en la red. En la pestaña Perfil: edita directamente tu nombre, título y biografía. Añade créditos con el botón +. Actualiza tu foto tocando el avatar.`],
    answers: [
      "Your profile is your Coterie calling card — what brands and members see when they search the network. On the Profile tab: edit your name, title, and bio directly. Add credits with the + button. Update your photo by tapping the avatar.",
    ],
  },
  {
    keywords: ["settings", "language", "notification", "privacy setting", "account setting"],
    zh: [`您的設置在「我」選項卡的「設定」下。您可以在那裡管理您的語言、通知、Éloi 偏好、隱私、帳戶詳情和法律文件。`],
    fr: [`Vos paramètres se trouvent dans l'onglet Moi sous Paramètres. Vous pouvez y gérer votre langue, vos notifications, vos préférences Éloi, votre confidentialité, les détails de votre compte et les documents légaux.`],
    it: [`Le tue impostazioni si trovano nella scheda Io sotto Impostazioni. Puoi gestire lì la tua lingua, le notifiche, le preferenze di Éloi, la privacy, i dettagli dell'account e i documenti legali.`],
    es: [`Tus ajustes están en la pestaña Yo bajo Configuración. Puedes gestionar allí tu idioma, notificaciones, preferencias de Éloi, privacidad, detalles de cuenta y documentos legales.`],
    answers: [
      "Your settings are in the Me tab under Settings. You can manage your language, notifications, Éloi preferences, privacy, account details, and legal documents there.",
    ],
  },
  {
    keywords: ["badge", "badges", "verified", "verification", "achievement"],
    zh: [`徽章是您個人資料上的認證成就。您持有精英會員（10 年以上認證）和品牌合作者（與三個或以上奢侈品牌的認證合作）。您的編輯聲音徽章正在審核中——它需要一個認證的一級出版物記錄。`],
    fr: [`Les badges sont des réalisations vérifiées sur votre profil. Vous détenez Membre Élite (10+ ans vérifiés) et Collaborateur de Marque (collaborations vérifiées avec trois maisons de luxe ou plus). Votre badge Voix Éditoriale est en cours d'examen — il nécessite un crédit de publication de Tier 1 vérifié.`],
    it: [`I badge sono traguardi verificati sul tuo profilo. Hai Membro Elite (10+ anni verificati) e Collaboratore Brand (collaborazioni verificate con tre o più maison di lusso). Il tuo badge Voce Editoriale è in fase di revisione — richiede un credito di pubblicazione di Tier 1 verificato.`],
    es: [`Los badges son logros verificados en tu perfil. Tienes Miembro Elite (10+ años verificados) y Colaborador de Marca (colaboraciones verificadas con tres o más maisons de lujo). Tu badge Voz Editorial está en revisión — requiere un crédito de publicación de Tier 1 verificado.`],
    answers: [
      "Badges are verified achievements on your profile. You hold Elite Member (10+ years verified) and Brand Collaborator (verified collaborations with three or more luxury houses). Your Editorial Voice badge is pending review — it requires a verified Tier 1 publication credit.",
    ],
  },
  {
    keywords: ["subscription", "billing", "renew", "cancel", "price", "cost", "pay", "charge"],
    zh: [`您的精英年度訂閱費用為每年 1,200 英鎊。您的更新日期在「我」選項卡的「計劃」下。要管理您的訂閱——取消、更新付款或降級——點擊「管理訂閱」或聯繫您的會員管理員。`],
    fr: [`Votre abonnement Élite annuel est de 2 400 £ par an. Votre date de renouvellement se trouve dans l'onglet Moi sous Plan. Pour gérer votre abonnement — annulation, mises à jour de paiement ou déclassement — appuyez sur Gérer l'abonnement ou contactez votre gestionnaire d'adhésion.`],
    it: [`Il tuo abbonamento Elite Annuale è di £2.400 all'anno. La tua data di rinnovo si trova nella scheda Io sotto Piano. Per gestire il tuo abbonamento — cancellazione, aggiornamenti di pagamento o declassamento — tocca Gestisci Abbonamento o contatta il tuo manager di membership.`],
    es: [`Tu suscripción Elite Anual es de £2.400 al año. Tu fecha de renovación está en la pestaña Yo bajo Plan. Para gestionar tu suscripción — cancelación, actualizaciones de pago o cambio de nivel — toca Gestionar Suscripción o contacta a tu gestor de membresía.`],
    answers: [
      "Your Elite Annual subscription is £1,200 per year. Your renewal date is in the Me tab under Plan. To manage your subscription — cancellation, payment updates, or downgrading — tap Manage Subscription or contact your membership manager.",
    ],
  },
  {
    keywords: ["demo", "book a demo", "onboarding", "walkthrough", "tutorial", "getting started"],
    zh: [`您可以從登入界面預訂私人演示——點擊「與我們的團隊預約演示」。我們將在 30 分鐘的通話中引導您了解完整平台。要在應用內重播 Éloi 導覽，請前往「我」→「設定」→ Éloi → 「重播教程」。`],
    fr: [`Vous pouvez réserver une démonstration privée depuis l'écran de connexion — appuyez sur Réserver une démo avec notre équipe. Nous vous guiderons à travers la plateforme complète en un appel de 30 minutes. Pour rejouer la visite Éloi dans l'application, allez dans Moi → Paramètres → Éloi → Rejouer le tutoriel.`],
    it: [`Puoi prenotare una demo privata dalla schermata di accesso — tocca Prenota una demo con il nostro team. Ti guideremo attraverso la piattaforma completa in una chiamata di 30 minuti. Per riprodurre il tour di Éloi nell'app, vai su Io → Impostazioni → Éloi → Riproduci tutorial.`],
    es: [`Puedes reservar una demo privada desde la pantalla de inicio de sesión — toca Reservar una demo con nuestro equipo. Te guiaremos por la plataforma completa en una llamada de 30 minutos. Para reproducir el recorrido de Éloi dentro de la app, ve a Yo → Configuración → Éloi → Reproducir tutorial.`],
    answers: [
      "You can book a private demo from the sign-in screen — tap Book a demo with our team. We'll walk you through the full platform in a 30-minute call. To replay the Éloi tour inside the app, go to Me → Settings → Éloi → Replay tutorial.",
    ],
  },
  {
    keywords: ["help", "support", "contact", "problem", "issue", "bug", "not working", "broken"],
    zh: [`如需支持，請通過您的會員管理員聯繫團隊——週一至週五，上午 9 時至下午 6 時（格林威治標準時間）。如有關於平台的快速問題，我隨時在此。您也可以在「我」→「設定」中找到「幫助與支持」。`],
    fr: [`Pour le support, contactez l'équipe via votre gestionnaire d'adhésion — disponible du lundi au vendredi, 9h–18h GMT. Pour les questions rapides sur la plateforme, je suis ici à tout moment. Vous pouvez également trouver Aide & Support dans Moi → Paramètres.`],
    it: [`Per supporto, contatta il team tramite il tuo manager di membership — disponibile dal lunedì al venerdì, 9:00–18:00 GMT. Per domande rapide sulla piattaforma, sono qui in qualsiasi momento. Puoi anche trovare Aiuto & Supporto in Io → Impostazioni.`],
    es: [`Para soporte, contacta al equipo a través de tu gestor de membresía — disponible de lunes a viernes, 9:00–18:00 GMT. Para preguntas rápidas sobre la plataforma, estoy aquí en cualquier momento. También puedes encontrar Ayuda y Soporte en Yo → Configuración.`],
    answers: [
      "For support, reach the team through your membership manager — available Monday to Friday, 9am–6pm GMT. For quick questions about the platform, I'm here any time. You can also find Help & Support in Me → Settings.",
    ],
  },
  {
    keywords: ["forgot password", "reset password", "lost password", "cannot login", "password reset"],
    zh: [`要重置您的密碼，請在登入界面點擊「忘記密碼？」。輸入您的註冊電郵，我們將立即發送重置連結。連結在 24 小時後過期。`],
    fr: [`Pour réinitialiser votre mot de passe, appuyez sur Mot de passe oublié ? sur l'écran de connexion. Entrez votre adresse e-mail enregistrée et nous vous enverrons un lien de réinitialisation immédiatement. Le lien expire après 24 heures.`],
    it: [`Per reimpostare la password, tocca Password dimenticata? nella schermata di accesso. Inserisci la tua email registrata e ti invieremo un link di reimpostazione immediatamente. Il link scade dopo 24 ore.`],
    es: [`Para restablecer tu contraseña, toca ¿Olvidaste tu contraseña? en la pantalla de inicio de sesión. Introduce tu correo electrónico registrado y te enviaremos un enlace de restablecimiento inmediatamente. El enlace caduca después de 24 horas.`],
    answers: [
      "To reset your password, tap Forgot password? on the sign-in screen. Enter your registered email and we'll send a reset link immediately. The link expires after 24 hours.",
    ],
  },
  {
    keywords: ["who are you", "what are you", "are you ai", "eloi", "what is eloi", "your name", "chatbot", "bot", "你是誰", "你是什麼", "éloi是什麼", "éloi是誰", "你叫什麼", "qui es-tu", "chi sei", "quién eres"],
    zh: [
      "我是 Éloi——Coterie 的私人禮賓。我協助您管理會員資格：職位、引薦、活動、個人資料、訂閱。我也談論時裝——各大時裝屋、設計師、當季趨勢、如何穿搭、應讀什麼。把我想像成您希望在 Coterie 晚宴上坐在您旁邊的那個人：精通業界、在有用時直言不諱，並且絕對低調。",
    ],
    fr: [
      "Je suis Éloi — le concierge privé de Coterie. Je vous aide à naviguer dans votre adhésion : rôles, introductions, événements, profil, abonnement. Je parle aussi de mode — les maisons, les créateurs, la saison actuelle, comment s'habiller, quoi lire.",
    ],
    it: [
      "Sono Éloi — il concierge privato di Coterie. Ti aiuto a navigare nella tua membership: ruoli, introduzioni, eventi, profilo, abbonamento. Parlo anche di moda — le maison, i designer, la stagione attuale, come vestirsi, cosa leggere.",
    ],
    es: [
      "Soy Éloi — el conserje privado de Coterie. Te ayudo a navegar tu membresía: roles, presentaciones, eventos, perfil, suscripción. También hablo de moda — las casas, los diseñadores, la temporada actual, cómo vestirte, qué leer.",
    ],
    answers: [
      "I'm Éloi — Coterie's private concierge. I help you navigate your membership: roles, introductions, events, profile, subscription. I also speak about fashion — the houses, the designers, the current season, how to dress, what to read. Think of me as the person you'd want to sit next to at a Coterie dinner: fluent in the industry, opinionated when it's useful, and entirely discreet.",
    ],
  },
  {
    keywords: ["career", "advice", "next step", "transition", "salary", "rate", "london", "industry", "market"],
    zh: [`根據您的個人資料，您已有充分的定位，可以晉升到一級出版物的時裝總監，或者轉型進入品牌層面的創意總監。兩條路徑都在活躍進行——Vogue UK 和 Burberry 在平台上都有與您背景密切匹配的職位。倫敦奢侈品市場對高級創意人才來說是強勁的，Burberry、Valentino 和 Loewe 都在積極建立其內部創意團隊。`],
    fr: [`D'après votre profil, vous êtes bien positionné(e) pour une montée en Directeur(trice) de Mode dans une publication de Tier 1, ou une transition vers la direction créative au niveau de la marque. Les deux trajectoires sont actives — Vogue UK et Burberry ont des rôles en direct sur la plateforme qui correspondent étroitement à votre parcours. Le marché du luxe londonien est fort pour les talents créatifs seniors.`],
    it: [`In base al tuo profilo, sei ben posizionato per un salto a Fashion Director presso una pubblicazione di primo livello, o una transizione alla direzione creativa a livello brand. Entrambi i percorsi sono attivi — Vogue UK e Burberry hanno entrambi ruoli in corso sulla piattaforma che si adattano da vicino al tuo background. Il mercato del lusso londinese è forte per i talenti creativi senior.`],
    es: [`Según tu perfil, estás bien posicionado(a) para un salto a Fashion Director en una publicación de Tier 1, o una transición a la dirección creativa a nivel de marca. Ambos caminos están activos — Vogue UK y Burberry tienen roles activos en la plataforma que se ajustan de cerca a tu background. El mercado del lujo londinense es fuerte para el talento creativo senior.`],
    answers: [
      "Based on your profile, you're well-positioned for either a step up to Fashion Director at a Tier 1 publication, or a move into creative direction at brand level. Both paths are active — Vogue UK and Burberry both have live roles on the platform that match your background closely.",
      "The London luxury market is strong for senior creative talent. Burberry, Valentino, and Loewe are actively building their in-house creative teams. Day rates for senior freelance stylists are running at £800–£1,200. Fashion Director salaries at major publications typically range £120,000–£160,000.",
    ],
  },
  {
    keywords: ["thank", "thanks", "great", "perfect", "helpful", "brilliant", "amazing", "hello", "hi", "hey", "good morning", "good evening", "謝謝", "你好", "早安", "晚安", "午安", "謝", "太好了", "merci", "bonjour", "bonsoir", "grazie", "ciao", "buongiorno", "gracias", "hola", "buenos días"],
    zh: [
      "很高興見到您。有什麼在您腦海中嗎？",
      "樂意效勞。您想了解什麼？",
      "當然。我能為您提供什麼幫助？",
      "歡迎回來。我在——請儘管提問。",
    ],
    fr: [
      "Ravi de vous voir. Qu'avez-vous en tête ?",
      "Avec plaisir. Que souhaitez-vous savoir ?",
      "Bien sûr. Comment puis-je vous aider ?",
      "Bienvenue. Je suis là — posez-moi n'importe quelle question.",
    ],
    it: [
      "Piacere di vederti. Cosa hai in mente?",
      "Ben volentieri. Cosa vorresti sapere?",
      "Certo. Come posso aiutarti?",
      "Bentornato. Sono qui — chiedimi pure.",
    ],
    es: [
      "Un placer verte. ¿Qué tienes en mente?",
      "Con gusto. ¿Qué te gustaría saber?",
      "Por supuesto. ¿En qué puedo ayudarte?",
      "Bienvenido/a de nuevo. Estoy aquí — pregúntame lo que quieras.",
    ],
    answers: [
      "Good to see you. What's on your mind?",
      "Happy to help. What would you like to know?",
      "Of course. What can I help you with?",
      "Welcome back. I'm here — ask me anything.",
    ],
  },
];

function getResponse(input: string, language: string, fallbacks: string[]): string {
  const lower = input.toLowerCase();
  const langKey = (language === "Traditional Chinese" || language === "Simplified Chinese") ? "zh"
    : language === "Français" ? "fr"
    : language === "Italiano" ? "it"
    : language === "Español" ? "es"
    : language === "Dutch" ? "nl"
    : language === "Polish" ? "pl"
    : language === "German" ? "de"
    : language === "Japanese" ? "ja"
    : language === "Korean" ? "ko"
    : language === "Português" ? "pt"
    : null;

  for (const group of KNOWLEDGE) {
    if (group.keywords.some((kw) => lower.includes(kw))) {
      // Use translated answers if available for this language
      const localAnswers = langKey ? (group as any)[langKey] as string[] | undefined : undefined;
      const pool = (localAnswers && localAnswers.length > 0) ? localAnswers : group.answers;
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
  time: string;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const DIGEST_TEXTS: Partial<Record<string, string>> = {
  "English": "✦  This week's digest — Week of 2 March 2026\n\nCreative Director Movements\nGlenn Martens has been confirmed as the incoming Creative Director at Diesel following his departure from Y/Project. His first collection is expected for SS27. At Bottega Veneta, Matthieu Blazy's quiet-luxury approach continues to define the commercial and critical conversation heading into Resort.\n\nNew Arrivals & Drops\nJil Sander's new co-direction has produced a capsule centred on technical wool fabrications — early buyer reactions are strong. Loewe's collaboration with the estate of a late painter is generating significant editorial interest ahead of its April release.\n\nIndustry Calendar\nParis Haute Couture Autumn–Winter presentations open 6 July. Coterie member studio visit bookings are now live via your membership manager. The Met Gala theme has been confirmed: \"Superfine: Tailoring Black Style.\"\n\nRetail Intelligence\nNet-a-Porter and MatchesFashion are accelerating partnerships with emerging designers from Africa and South Asia. Buying teams are actively seeking stylists with regional expertise for dedicated editorial projects.\n\nCoterie Insider\nThree new Elite members joined this week. The April Coterie Dinner, London, is at 92% capacity — RSVP if you haven't already.",
  "Traditional Chinese": "✦  本週摘要——2026 年 3 月 2 日週報\n\n創意總監動向\nGlenn Martens 離開 Y/Project 後，已確認接任 Diesel 創意總監。首個系列預計在 SS27 亮相。Bottega Veneta 方面，Matthieu Blazy 的靜奢路線持續主導商業與評論話題。\n\n新品速遞\nJil Sander 新任聯合創意總監推出以技術羊毛為核心的膠囊系列，買手反應正面。Loewe 與一位已故畫家遺產的聯名系列，四月上市前已引發大量編輯關注。\n\n行業日曆\n巴黎秋冬高級訂製時裝週將於 7 月 6 日開幕。Coterie 會員工作室參訪預約現已透過您的會員管理員開放登記。Met Gala 主題已確認：「Superfine: Tailoring Black Style」。\n\nCoterie 內部動態\n本週三位新精英會員加入。4 月 Coterie 倫敦晚宴名額已達九成二，如您尚未報名請儘快確認。",
  "Français": "✦  Digest de la semaine — Semaine du 2 mars 2026\n\nMouvements à la Direction Créative\nGlenn Martens a été confirmé comme prochain Directeur Créatif chez Diesel après son départ de Y/Project. Sa première collection est attendue pour SS27. Chez Bottega Veneta, l'approche quiet luxury de Matthieu Blazy continue de définir la conversation commerciale et critique.\n\nNouveautés & Collections\nLa nouvelle co-direction de Jil Sander a produit une capsule axée sur des tissus en laine technique. La collaboration de Loewe avec la succession d'un peintre décédé génère un fort intérêt éditorial avant sa sortie en avril.\n\nCoterie Insider\nTrois nouveaux membres Élite ont rejoint cette semaine. Le Dîner Coterie d'avril, à Londres, est à 92 % de sa capacité — confirmez votre présence si ce n'est pas encore fait.",
  "Italiano": "✦  Digest della settimana — Settimana del 2 marzo 2026\n\nMovimenti dei Direttori Creativi\nGlenn Martens è stato confermato come prossimo Direttore Creativo di Diesel dopo la sua partenza da Y/Project. La prima collezione è attesa per SS27. Da Bottega Veneta, l'approccio quiet luxury di Matthieu Blazy continua a definire la conversazione commerciale e critica.\n\nCoterie Insider\nTre nuovi membri Elite si sono uniti questa settimana. La Coterie Dinner di aprile a Londra è al 92% di capacità — conferma la tua presenza se non l'hai ancora fatto.",
  "Español": "✦  Resumen de la semana — Semana del 2 de marzo de 2026\n\nMovimientos de Directores Creativos\nGlenn Martens ha sido confirmado como próximo Director Creativo en Diesel tras su salida de Y/Project. Su primera colección se espera para SS27. En Bottega Veneta, el enfoque quiet luxury de Matthieu Blazy sigue definiendo la conversación comercial y crítica.\n\nCoterie Insider\nTres nuevos miembros Elite se unieron esta semana. La Cena Coterie de abril en Londres está al 92% de su capacidad — confirma tu asistencia si aún no lo has hecho.",
  "Simplified Chinese": "✦  本周摘要——2026年3月2日周报\n\n创意总监动态\nGlenn Martens离开Y/Project后，已确认接任Diesel创意总监。首个系列预计于SS27亮相。Bottega Veneta方面，Matthieu Blazy的静奢路线持续主导商业与评论话题。\n\n新品速递\nJil Sander新任联合创意总监推出以技术羊毛为核心的胶囊系列，买手反应积极。Loewe与一位已故画家遗产的联名系列，四月上市前已引发大量编辑关注。\n\nCoterie内部动态\n本周三位新精英会员加入。4月Coterie伦敦晚宴名额已达92%，如您尚未报名请尽快确认。",
  "Dutch": "✦  Weekoverzicht — Week van 2 maart 2026\n\nBewegingen Creatief Directeurs\nGlenn Martens is bevestigd als de nieuwe Creatief Directeur bij Diesel na zijn vertrek bij Y/Project. Zijn eerste collectie wordt verwacht voor SS27. Bij Bottega Veneta blijft de quiet luxury-aanpak van Matthieu Blazy de commerciële en kritische conversatie bepalen.\n\nNieuwe Collecties\nDe nieuwe co-directie van Jil Sander heeft een capsule geproduceerd gericht op technische wollen stoffen. De samenwerking van Loewe met de nalatenschap van een overleden schilder wekt aanzienlijke redactionele interesse voor de release in april.\n\nCoterie Insider\nDeze week zijn drie nieuwe Elite-leden toegetreden. Het Coterie Diner in april in Londen is voor 92% volgeboekt — bevestig uw aanwezigheid als u dat nog niet heeft gedaan.",
  "Polish": "✦  Przegląd tygodnia — Tydzień 2 marca 2026\n\nRuchy Dyrektorów Kreatywnych\nGlenn Martens został potwierdzony jako nowy Dyrektor Kreatywny w Diesel po odejściu z Y/Project. Jego pierwsza kolekcja spodziewana jest na SS27. W Bottega Veneta podejście quiet luxury Matthieu Blazy'ego nadal definiuje rozmowę komercyjną i krytyczną.\n\nNowe Kolekcje\nNowa ko-dyrekcja Jil Sander stworzyła kapsułę skoncentrowaną na technicznych tkaninach wełnianych. Współpraca Loewe ze spuścizną zmarłego malarza wzbudza duże zainteresowanie redakcyjne przed premierą w kwietniu.\n\nCoterie Insider\nW tym tygodniu dołączyło trzech nowych członków Elite. Kolacja Coterie w kwietniu w Londynie jest zapełniona w 92% — potwierdź swoją obecność, jeśli jeszcze tego nie zrobiłeś.",
  "German": "✦  Wochenübersicht — Woche vom 2. März 2026\n\nBewegungen der Kreativdirektoren\nGlenn Martens wurde nach seinem Abgang von Y/Project als neuer Kreativdirektor bei Diesel bestätigt. Seine erste Kollektion wird für SS27 erwartet. Bei Bottega Veneta prägt Matthieu Blazys Quiet-Luxury-Ansatz weiterhin die kommerzielle und kritische Diskussion.\n\nNeue Kollektionen\nDie neue Ko-Direktion von Jil Sander hat eine Kapsel mit Fokus auf technischen Wollstoffen produziert. Die Zusammenarbeit von Loewe mit dem Nachlass eines verstorbenen Malers weckt erhebliches redaktionelles Interesse vor der April-Veröffentlichung.\n\nCoterie Insider\nDiese Woche sind drei neue Elite-Mitglieder beigetreten. Das Coterie-Dinner im April in London ist zu 92 % ausgebucht — bestätigen Sie Ihre Teilnahme, falls noch nicht geschehen.",
  "Japanese": "✦  今週のダイジェスト — 2026年3月2日週\n\nクリエイティブディレクター動向\nGlenn MartensがY/Projectを離れ、Dieselの次期クリエイティブディレクターに就任することが確認されました。初コレクションはSS27を予定。Bottega Venetaでは、Matthieu Blazyのクワイエットラグジュアリーのアプローチがリゾートに向けて商業・批評の話題を牽引し続けています。\n\n新着・ドロップ\nJil Sanderの新任共同ディレクションは、テクニカルウール素材を中心としたカプセルを発表 — バイヤーの反応は好調。Loeweと故画家の遺産とのコラボレーションは、4月の発売に向けて大きな編集的関心を集めています。\n\nCoterie インサイダー\n今週、新たに3名のエリート会員が加わりました。4月のCoterie ロンドンディナーは92%の定員に達しています — まだの方はRSVPをお願いします。",
  "Korean": "✦  이번 주 다이제스트 — 2026년 3월 2일 주\n\n크리에이티브 디렉터 동향\nGlenn Martens가 Y/Project를 떠난 후 Diesel의 차기 크리에이티브 디렉터로 확정되었습니다. 첫 컬렉션은 SS27로 예정. Bottega Veneta에서는 Matthieu Blazy의 콰이어트 럭셔리 접근 방식이 리조트를 앞두고 상업적·비평적 대화를 계속 주도하고 있습니다.\n\n신상품 & 드롭\nJil Sander의 새 공동 디렉션은 테크니컬 울 소재 중심의 캡슐을 선보였습니다 — 바이어 반응이 긍정적입니다. Loewe와 고인이 된 화가의 유산과의 협업은 4월 출시를 앞두고 상당한 편집적 관심을 모으고 있습니다.\n\nCoterie 인사이더\n이번 주 새로운 엘리트 회원 3명이 합류했습니다. 4월 Coterie 런던 디너는 92% 찼습니다 — 아직 등록하지 않으셨다면 RSVP 해주세요.",
  "Português": "✦  Digest desta semana — Semana de 2 de março de 2026\n\nMovimentos de Diretores Criativos\nGlenn Martens foi confirmado como o próximo Diretor Criativo da Diesel após a sua saída da Y/Project. A primeira coleção está prevista para SS27. Na Bottega Veneta, a abordagem quiet luxury de Matthieu Blazy continua a definir a conversa comercial e crítica a caminho do Resort.\n\nNovas Coleções & Lançamentos\nA nova co-direção da Jil Sander produziu uma cápsula centrada em tecidos de lã técnica — as reações dos compradores são fortes. A colaboração da Loewe com o espólio de um pintor falecido está a gerar um interesse editorial significativo antes do seu lançamento em abril.\n\nCoterie Insider\nTrês novos membros Elite juntaram-se esta semana. O Coterie Dinner de abril, em Londres, está a 92% da capacidade — confirme a sua presença se ainda não o fez.",
};

function makeInitialMessages(greeting: string, language: string): Message[] {
  const digestText = DIGEST_TEXTS[language] ?? DIGEST_TEXTS["English"]!;
  return [
    { id: "init",   role: "ai", text: greeting,    time: nowTime() },
    { id: "digest", role: "ai", text: digestText,  time: nowTime() },
  ];
}

// ── Tab bar height constant — used to offset input bar ──────────────────────
// The custom tab bar is position:absolute at the bottom.
// We add TAB_BAR_HEIGHT to clear it.
const TAB_BAR_HEIGHT = 60;

// ── Typing Indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  const { theme } = useTheme();
  const a0 = useRef(new Animated.Value(0)).current;
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeSeq = (a: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(a, { toValue: 1, duration: 280, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(a, { toValue: 0.2, duration: 280, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.delay(420),
        ])
      );
    const s0 = makeSeq(a0, 0);
    const s1 = makeSeq(a1, 160);
    const s2 = makeSeq(a2, 320);
    s0.start(); s1.start(); s2.start();
    return () => { s0.stop(); s1.stop(); s2.stop(); };
  }, []);

  return (
    <View style={ti.wrap}>
      <View style={[ti.bubble, { backgroundColor: theme.surface }]}>
        {[a0, a1, a2].map((a, i) => (
          <Animated.View key={i} style={[ti.dot, { backgroundColor: theme.muted, opacity: a }]} />
        ))}
      </View>
    </View>
  );
}

const ti = StyleSheet.create({
  wrap:   { paddingHorizontal: 20, paddingVertical: 4, alignItems: "flex-start" },
  bubble: { borderRadius: RADIUS.xl, paddingHorizontal: 18, paddingVertical: 16, flexDirection: "row", gap: 5, alignItems: "center" },
  dot:    { width: 6, height: 6, borderRadius: 3 },
});

// ── Message Bubble ────────────────────────────────────────────────────────────

function Bubble({ message }: { message: Message }) {
  const { theme } = useTheme();
  const isUser = message.role === "user";

  return (
    <View style={[bb.wrap, isUser && bb.wrapUser]}>
      {!isUser && (
        <View style={[bb.aiAvatar, { backgroundColor: theme.fill }]}>
          <Text style={[bb.aiAvatarText, { color: theme.muted }]}>✦</Text>
        </View>
      )}
      <View style={bb.inner}>
        <View style={[bb.bubble, isUser ? { backgroundColor: theme.invertBg } : { backgroundColor: theme.surface }]}>
          <Text style={[bb.text, { color: isUser ? theme.invertText : theme.text }]}>{message.text}</Text>
        </View>
        <Text style={[bb.time, { color: theme.dim, textAlign: isUser ? "right" : "left" }]}>{message.time}</Text>
      </View>
    </View>
  );
}

const bb = StyleSheet.create({
  wrap:        { paddingHorizontal: 20, paddingVertical: 4, flexDirection: "row", alignItems: "flex-end", gap: 8 },
  wrapUser:    { flexDirection: "row-reverse" },
  aiAvatar:    { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 18, flexShrink: 0 },
  aiAvatarText:{ fontSize: 10 },
  inner:       { flex: 1, gap: 4 },
  bubble:      { borderRadius: RADIUS.xl, paddingHorizontal: 16, paddingVertical: 13 },
  text:        { fontFamily: FONT.sansRegular, fontSize: 14, lineHeight: 22 },
  time:        { fontFamily: FONT.sansRegular, fontSize: 9, letterSpacing: 0.3, paddingHorizontal: 4 },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, fc, language } = useLanguage();
  const listRef = useRef<FlatList>(null);

  const initialMessages = React.useMemo(
    () => makeInitialMessages(t.eloiGreeting, language),
    [language, t.eloiGreeting],
  );
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Reset chat messages when language changes
  React.useEffect(() => {
    setMessages(makeInitialMessages(t.eloiGreeting, language));
  }, [language, t.eloiGreeting]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput("");

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: trimmed, time: nowTime() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    scrollToBottom();

    const delay = 900 + Math.random() * 700;
    await new Promise((r) => setTimeout(r, delay));

    const response = getResponse(trimmed, language, t.eloiFallbacks);
    const aiMsg: Message = { id: `a-${Date.now()}`, role: "ai", text: response, time: nowTime() };

    setTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollToBottom();
  }, [typing, scrollToBottom, language, t.eloiFallbacks]);

  const showQuickPrompts = messages.length === 2;

  // The input bar needs padding equal to TAB_BAR_HEIGHT to sit above the tab bar.
  // KAV then lifts everything above the keyboard on top of that.
  const inputBarBottomPad = insets.bottom + TAB_BAR_HEIGHT + 6;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: theme.bg }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.6}>
            <Feather name="arrow-left" size={20} color={theme.muted} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Label>{t.yourConcierge}</Label>
            <Text style={[styles.heading, { color: theme.text, fontFamily: fc.serifFamily, fontSize: fc.hs(48), lineHeight: fc.hl(fc.hs(48)) }]}>Éloi</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }]}>
            <View style={[styles.statusDot, { backgroundColor: theme.text }]} />
            <Text style={[styles.statusText, { color: theme.muted }]}>{t.available}</Text>
          </View>
        </View>
        <Divider />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        style={{ flex: 1 }}
        contentContainerStyle={[styles.listContent, { paddingBottom: inputBarBottomPad + 64 }]}
        showsVerticalScrollIndicator={false}
        onLayout={scrollToBottom}
        ListFooterComponent={typing ? <TypingIndicator /> : null}
        renderItem={({ item, index }) => (
          <>
            <Bubble message={item} />
            {index === 1 && showQuickPrompts && (
              <View style={styles.quickPrompts}>
                {t.eloiQuickPrompts.map((q) => (
                  <TouchableOpacity
                    key={q}
                    onPress={() => sendMessage(q)}
                    style={[styles.quickPill, { backgroundColor: theme.fill, borderRadius: RADIUS.pill }, !isDark && SHADOW.card]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.quickText, { color: theme.muted }]}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      />

      {/* Input — sits above the tab bar */}
      <View style={[styles.inputBar, { backgroundColor: theme.bg, paddingBottom: inputBarBottomPad, borderTopColor: theme.border }]}>
        <View style={[styles.inputWrap, { backgroundColor: theme.surface, borderRadius: RADIUS.xl }, !isDark && SHADOW.card]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={input}
            onChangeText={setInput}
            placeholder={t.askEloiPlaceholder}
            placeholderTextColor={theme.dim}
            selectionColor={theme.text}
            multiline
            returnKeyType="send"
            blurOnSubmit
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            style={[
              styles.sendBtn,
              { backgroundColor: input.trim() && !typing ? theme.invertBg : theme.fill, borderRadius: RADIUS.pill },
            ]}
            activeOpacity={0.7}
          >
            <Feather name="arrow-up" size={15} color={input.trim() && !typing ? theme.invertText : theme.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  header:      { paddingHorizontal: 20, gap: 14, paddingBottom: 0 },
  headerInner: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  backBtn:     { paddingRight: 12, paddingTop: 18, alignSelf: "flex-start" },
  heading:     { fontFamily: FONT.serifLight, fontSize: 48, lineHeight: 54, letterSpacing: 0.3, marginTop: 8 },
  statusPill:  { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, marginTop: 14 },
  statusDot:   { width: 5, height: 5, borderRadius: 2.5 },
  statusText:  { fontFamily: FONT.sansMedium, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" },
  listContent: { paddingTop: 16 },
  quickPrompts:{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  quickPill:   { paddingHorizontal: 16, paddingVertical: 10 },
  quickText:   { fontFamily: FONT.sansMedium, fontSize: 11, letterSpacing: 0.3 },
  inputBar:    { paddingHorizontal: 16, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  inputWrap:   { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 14, paddingVertical: 8, gap: 10 },
  input:       { flex: 1, fontFamily: FONT.sansRegular, fontSize: 15, maxHeight: 100, paddingVertical: 6 },
  sendBtn:     { width: 34, height: 34, alignItems: "center", justifyContent: "center", marginBottom: 2 },
});
