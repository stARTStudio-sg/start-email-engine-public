import { useMemo, useState } from "react";

type Article = {
  id: string;
  category: string;
  title: string;
  source: string;
  url: string;
  summary: string;
  parentConcern: string;
  emailFit: string;
  keywords: string[];
};

type Angle = {
  id: string;
  title: string;
  frame: string;
  why: string;
};

type Style = {
  id: string;
  name: string;
  description: string;
};

type Formula = {
  id: string;
  name: string;
  label: string;
  description: string;
  subject: string;
};

const signature = `Elfin
Founder, stART Studio
Author, Bond. Build. Become.
Creator, KiKnowa Family Conversation Cards`;

const starterArticles: Article[] = [
  {
    id: "sg-screen-time",
    category: "Singapore parenting",
    title: "When screen time becomes the easiest babysitter at home",
    source: "CNA Lifestyle",
    url: "https://cnalifestyle.channelnewsasia.com/singapore/children-parents-screen-time-health-physical-activity-sleep-312191",
    summary:
      "Parents are juggling work, meals, homework, enrichment and exhaustion. Screens can become the quiet helper, but children still need connection and rhythm.",
    parentConcern: "I know screens are not ideal, but I am too tired to fight another battle.",
    emailFit: "A compassionate email about replacing shame with small moments of connection.",
    keywords: ["screen", "digital", "tired", "connection"],
  },
  {
    id: "sg-mental-wellbeing",
    category: "Singapore news",
    title: "Children need safe adults before they can speak honestly",
    source: "The Straits Times",
    url: "https://www.straitstimes.com/singapore/childrens-society-to-focus-on-early-support-for-families-in-new-five-year-plan",
    summary:
      "Singapore families are talking more about children, stress, mental wellbeing and the pressure to perform well in school and life.",
    parentConcern: "My child tells me very little. I worry I only hear the truth when something has gone wrong.",
    emailFit: "A reflective email about creating emotional safety before correction.",
    keywords: ["stress", "school", "safety", "voice"],
  },
  {
    id: "asia-exam-pressure",
    category: "Asia news",
    title: "Why high-achieving children may still feel unseen",
    source: "Greater Good Magazine",
    url: "https://greatergood.berkeley.edu/article/item/a_better_way_to_develop_your_childs_confidence",
    summary:
      "Across many Asian families, achievement can become the language of love. Children may look successful while quietly wondering if they are enough.",
    parentConcern: "I want my child to do well, but I do not want them to feel loved only when they perform.",
    emailFit: "A thoughtful email about self-worth beyond results.",
    keywords: ["exam", "achievement", "self-worth", "pressure"],
  },
  {
    id: "global-confidence",
    category: "Global parenting",
    title: "Confidence grows when children are trusted with small choices",
    source: "Greater Good Magazine",
    url: "https://greatergood.berkeley.edu/article/item/how_to_raise_kids_who_feel_capable_in_the_world",
    summary:
      "Children build resilience and confidence through repeated experiences of being trusted, guided and allowed to try again.",
    parentConcern: "I step in too quickly because I want to help. Maybe I am accidentally taking away practice.",
    emailFit: "A warm email about confidence being crafted one small attempt at a time.",
    keywords: ["confidence", "resilience", "choice", "growth"],
  },
  {
    id: "viral-child-voice",
    category: "Trending conversation",
    title: "The tiny stories children tell when they finally have our attention",
    source: "Parents",
    url: "https://www.parents.com/parenting/better-parenting/advice/questions-every-parent-should-ask-their-kid/",
    summary:
      "Relatable parenting posts often go viral because tired parents recognise the ache of wanting a quiet moment while their child wants to tell a long story.",
    parentConcern: "I love my child, but sometimes their stories come when I have nothing left.",
    emailFit: "A tender, funny email about listening even when we are tired.",
    keywords: ["listening", "voice", "tired", "story"],
  },
  {
    id: "global-creative-play",
    category: "International research",
    title: "Creative play gives children language for feelings they cannot explain",
    source: "Harvard Center on the Developing Child",
    url: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    summary:
      "Children often process feelings through play, art, storytelling and repeated safe interactions with adults.",
    parentConcern: "My child cannot always explain what they feel. I need another way to understand them.",
    emailFit: "An email connecting art-making with emotional expression and parent-child bonding.",
    keywords: ["art", "play", "feelings", "expression"],
  },
];

const extraResearch: Article[] = [
  ["parent-burnout", "Parent wellbeing", "The invisible weight carried by mentally overloaded parents", "Psychology Today", "https://www.psychologytoday.com/us/blog/the-compassionate-brain/202412/mental-load-the-invisible-weight-of-parenthood", "The daily work of remembering, organising and anticipating can leave loving parents emotionally empty.", "I love my family, but I feel like I am carrying everything.", "A validating email about caring for the parent behind the parenting.", ["burnout", "mental-load"]],
  ["child-anxiety", "Child wellbeing", "Anxious children often need connection before reassurance", "Child Mind Institute", "https://childmind.org/article/what-to-do-and-not-do-when-children-are-anxious/", "Repeated reassurance can calm a moment without helping a child feel capable of meeting uncertainty.", "I keep telling my child not to worry, but the worry keeps returning.", "A practical email about steady presence and emotional confidence.", ["anxiety", "connection"]],
  ["overscheduling", "Trending parenting", "Are our children too busy to discover who they are?", "HealthyChildren.org", "https://www.healthychildren.org/English/family-life/family-dynamics/Pages/comfort-and-joy-family-tips-for-enjoying-the-winter-holidays.aspx", "Full calendars can crowd out boredom, imagination and unstructured family time.", "I want to give my child opportunities, but I wonder whether we are doing too much.", "A reflective email about space, play and enoughness.", ["busy", "play"]],
  ["friendship", "School life", "When a child says nobody wants to play with me", "UNICEF Parenting", "https://www.unicef.org/parenting/child-care/what-you-need-know-about-parent-child-attachment", "Friendship struggles can feel enormous to a child and surprisingly difficult for a parent to hold.", "Should I step in, teach a skill or simply listen?", "An empathetic email about being a safe landing place.", ["friendship", "listen"]],
  ["praise", "Parenting insight", "Why constant praise does not always create confidence", "Greater Good Magazine", "https://greatergood.berkeley.edu/article/item/a_better_way_to_develop_your_childs_confidence", "Children grow steadier confidence when adults notice process, agency and honest effort.", "I praise my child often, but they still fear getting things wrong.", "An email about confidence built through experience.", ["confidence", "praise"]],
  ["mistakes", "Viral conversation", "The child who cries when one small thing goes wrong", "Parents", "https://www.parents.com/kids/development/behavioral/emotionally-sensitive-children/", "Perfectionism can turn small mistakes into threats to a child's sense of worth.", "My child gives up the moment the result is not perfect.", "A compassionate email about mistakes, repair and courage.", ["mistakes", "perfectionism"]],
  ["morning-rush", "Everyday parenting", "The morning rush is often where connection disappears first", "Today's Parent", "https://www.todaysparent.com/family/parenting/", "Getting everyone out the door can turn parents into managers and children into tasks.", "Every morning ends with me shouting, even when I promised myself I would not.", "A relatable email about one small pause inside the rush.", ["morning", "connection"]],
  ["homework", "Education", "Homework battles may be about more than motivation", "Edutopia", "https://www.edutopia.org/topic/parent-partnerships", "Avoidance can hide confusion, fear of failure, tiredness or a need for autonomy.", "Why does homework become a fight every single night?", "An insight-led email about looking beneath behaviour.", ["homework", "behaviour"]],
  ["sibling", "Family relationships", "What sibling conflict can teach children about repair", "Harvard Health", "https://www.health.harvard.edu/topics/child-and-teen-health", "Conflict is not proof of a broken relationship; guided repair can build lifelong skills.", "My children fight constantly and I feel I am failing to keep peace.", "A reassuring email about coaching rather than refereeing.", ["siblings", "repair"]],
  ["independence", "Child development", "The confidence children gain when adults stop doing everything for them", "HealthyChildren.org", "https://www.healthychildren.org/English/family-life/family-dynamics/Pages/default.aspx", "Age-appropriate responsibility helps children experience usefulness, competence and belonging.", "Helping is faster, but am I stopping my child from learning?", "A practical email about stepping back with support.", ["independence", "confidence"]],
  ["tantrums", "Parent concern", "A meltdown is not the same as bad behaviour", "Zero to Three", "https://www.zerotothree.org/resource/positive-parenting/", "Young children borrow calm from adults while their regulation skills are still developing.", "People are watching and I feel pressured to stop the tantrum immediately.", "A shame-free email about co-regulation and dignity.", ["meltdown", "regulation"]],
  ["teen-silence", "Parent concern", "When an older child answers every question with fine", "Raising Children Network", "https://raisingchildren.net.au/teens/communicating-relationships", "Direct questions can feel like pressure when young people are still organising their inner world.", "I miss knowing what is happening inside my child.", "A gentle email about creating invitations instead of interrogations.", ["teen", "voice"]],
  ["creative-risk", "Arts education", "Creative work teaches children to risk being seen", "National Endowment for the Arts", "https://www.arts.gov/impact/arts-education", "Making something personal and sharing it can grow courage, expression and self-trust.", "My child says they are not good at art before they even begin.", "A stART Studio email about creative courage.", ["art", "courage"]],
  ["comparison", "Social media", "Children are comparing themselves earlier and more often", "Common Sense Media", "https://www.commonsensemedia.org/articles/social-media", "Curated images and visible metrics can make childhood feel like a public competition.", "How do I protect my child's self-worth without banning everything?", "An email about an inner compass stronger than comparison.", ["social", "self-worth"]],
  ["bedtime", "Everyday parenting", "Why children suddenly have everything to say at bedtime", "NPR Life Kit", "https://www.npr.org/lifekit", "Quiet transitions often give children the first safe opening to release thoughts held all day.", "I am exhausted just when my child finally wants to talk.", "A tender, humorous email about inconvenient moments of connection.", ["bedtime", "listen"]],
  ["labels", "Language matters", "The quiet cost of calling a child shy, naughty or difficult", "UNICEF Parenting", "https://www.unicef.org/parenting/child-care", "Repeated labels can become identities that narrow how a child sees themselves.", "I use these words casually, but could my child be absorbing them?", "A reflective email about describing moments without defining children.", ["labels", "identity"]],
  ["boredom", "Trending parenting", "Boredom may be the doorway to a child's own ideas", "The Atlantic", "https://www.theatlantic.com/family/", "When adults fill every empty minute, children get less practice initiating, imagining and persisting.", "My child expects me to entertain them all the time.", "A freeing email about protecting creative emptiness.", ["boredom", "creativity"]],
  ["apology", "Emotional growth", "What children learn when a parent genuinely apologises", "Greater Good Magazine", "https://greatergood.berkeley.edu/topic/parenting", "Repair shows children that love can survive mistakes and authority can include humility.", "Will apologising make my child respect me less?", "A powerful email about trust, repair and modelling.", ["apology", "repair"]],
  ["school-refusal", "School wellbeing", "School refusal is communication, not simply defiance", "Child Mind Institute", "https://childmind.org/article/when-kids-refuse-to-go-to-school/", "Avoiding school may signal anxiety, overwhelm, learning difficulty or social pain.", "Every morning has become a crisis and I do not know how hard to push.", "An empathetic email about curiosity before control.", ["school", "anxiety"]],
  ["messy-art", "Creative development", "Why process art matters more than a perfect finished product", "NAEYC", "https://www.naeyc.org/resources/topics/creative-arts", "Open-ended art gives children choice, experimentation and ownership of the result.", "I want to help, but I keep correcting the artwork.", "A brand-led email about trusting the child's process.", ["art", "process"]],
  ["big-feelings", "Viral parenting", "The phrase 'calm down' rarely teaches a child how to calm down", "Good Inside", "https://www.goodinside.com/blog/", "Regulation grows through repeated experiences of being accompanied, named and guided.", "I know my child needs calm, but I am also losing mine.", "A practical and compassionate email about shared regulation.", ["feelings", "regulation"]],
  ["one-on-one", "Family connection", "Ten minutes of undivided attention can change the tone of a day", "Aha! Parenting", "https://www.ahaparenting.com/read/connection-parenting", "Short predictable rituals of attention can reduce attention-seeking and strengthen trust.", "I do not have hours of quality time to give every day.", "A hopeful email about small, repeatable connection.", ["attention", "connection"]],
  ["achievement-love", "Asia parenting", "When children confuse achievement with belonging", "South China Morning Post", "https://www.scmp.com/lifestyle/family-relationships", "Performance pressure can quietly teach children that approval must be earned.", "How can I encourage excellence without making love feel conditional?", "A deep email about belonging before performance.", ["achievement", "belonging"]],
  ["parent-trigger", "Parent growth", "The behaviour that triggers us may point to our own unfinished story", "Psychology Today", "https://www.psychologytoday.com/intl/basics/parenting", "Parenting can surface old fears and expectations that belong partly to the adult's history.", "Why does this one behaviour make me react so strongly?", "A Bond. Build. Become. email about the child as mirror.", ["mirror", "growth"]],
].map(([id, category, title, source, url, summary, parentConcern, emailFit, keywords]) => ({
  id, category, title, source, url, summary, parentConcern, emailFit, keywords,
} as Article));

const researchArticles = [...starterArticles, ...extraResearch].slice(0, 12);

const styles: Style[] = [
  {
    id: "elfin",
    name: "Elfin Reflective",
    description: "Gentle, personal and emotionally observant. Begins with an ordinary moment, pauses to notice its deeper meaning, and speaks to parents without judgement.",
  },
  {
    id: "ben",
    name: "Direct Curiosity",
    description: "Opens with a surprising question or bold observation. Uses short, clear paragraphs to create momentum and keep the reader curious.",
  },
  {
    id: "russell",
    name: "Story Funnel",
    description: "Begins inside a relatable story, widens into a meaningful parenting insight, and guides the reader naturally towards one practical invitation.",
  },
  {
    id: "jaz",
    name: "Heart Mentor",
    description: "Feels like a trusted mentor sitting beside a tired parent. Validates the struggle first, then offers reassurance, hope and a gentle next step.",
  },
  {
    id: "eric",
    name: "Insight Teacher",
    description: "Explains one useful idea in a simple, organised way. Connects observation to insight and gives parents language they can apply immediately.",
  },
  {
    id: "vinh",
    name: "Spoken Stage",
    description: "Sounds natural when read aloud. Uses conversational phrasing, rhythm, repetition and memorable lines that could also work on stage or video.",
  },
];

const formulas: Formula[] = [
  { id: "story", label: "STORY", name: "Storytelling", description: "Warm, human and easy to enter through one meaningful moment.", subject: "A small moment that made me pause" },
  { id: "suggestion", label: "SUGGESTION", name: "Power of Suggestion", description: "Help parents arrive at the insight gently, without feeling corrected.", subject: "What if the real question is not the behaviour?" },
  { id: "contrarian", label: "CONTRARIAN", name: "Contrarian", description: "Challenge the usual parenting reaction with a stronger point of view.", subject: "Maybe the mistake is not the biggest problem" },
  { id: "pain", label: "PAIN MIRROR", name: "Pain Mirror Formula", description: "Help parents feel deeply understood before offering the next step.", subject: "When you keep reminding and nothing seems to change" },
  { id: "loop", label: "STORY LOOP", name: "Addictive Story Formula", description: "Build curiosity and emotional momentum so readers keep going.", subject: "I almost missed what the child was really saying" },
  { id: "brunson", label: "BRUNSON", name: "Russell Brunson Formula", description: "Move through hook, story, belief shift and a clear invitation.", subject: "The small shift that helps children open up" },
];

const hookPatterns = [
  "Children do not remember how tired we were. They remember whether we listened.",
  "The moment a child talks non-stop may be the moment they are asking, 'Do I matter to you?'",
  "Sometimes the most important parenting choice is not what we say next, but whether we stay.",
  "Your child may forget the activity. They may not forget the look on your face.",
  "A tired parent can still become a safe place.",
  "Before children tell us the big things, they test us with the small things.",
  "It sounds like a long story about nothing. To the child, it is an invitation.",
  "The child who keeps talking may not be trying to disturb us. They may be trying to include us.",
  "Connection is often built in the five minutes we almost rush through.",
  "When we make room for a child's voice, we also make room for their confidence.",
  "The art may look messy. The sharing is not.",
  "A child learns self-worth when their ordinary stories are treated as worth hearing.",
];

function makeAngles(article: Article): Angle[] {
  const text = `${article.title} ${article.summary} ${article.parentConcern} ${article.keywords.join(" ")}`.toLowerCase();
  const angleBank: Angle[] = [];

  if (text.includes("screen") || text.includes("digital")) {
    angleBank.push({
      id: "less-shame",
      title: "Less screen shame, more small connection",
      frame: "Write from the reality of tired parents who need small doable changes, not another lecture.",
      why: "This respects parents before inviting a better rhythm.",
    });
  }

  if (text.includes("school") || text.includes("exam") || text.includes("achievement")) {
    angleBank.push({
      id: "worth-beyond-results",
      title: "Your child is more than the result",
      frame: "Write about helping children feel loved before they feel measured.",
      why: "It speaks to Singapore and Asia achievement pressure with tenderness.",
    });
  }

  if (text.includes("voice") || text.includes("listening") || text.includes("story")) {
    angleBank.push({
      id: "make-space",
      title: "Make space for the child's voice",
      frame: "Write about the small stories children tell when they are checking whether we are still available.",
      why: "It turns a funny tired-parent moment into a deep parenting insight.",
    });
  }

  if (text.includes("confidence") || text.includes("choice") || text.includes("resilience")) {
    angleBank.push({
      id: "confidence-practice",
      title: "Confidence is practised, not praised into existence",
      frame: "Write about small independent attempts that help children trust themselves.",
      why: "It connects directly to stART Studio's promise of crafting confidence.",
    });
  }

  if (text.includes("art") || text.includes("play") || text.includes("feelings")) {
    angleBank.push({
      id: "art-language",
      title: "Art gives feelings another language",
      frame: "Write about painting and play as doorways into what children cannot explain yet.",
      why: "It makes the stART Studio method feel natural and meaningful.",
    });
  }

  angleBank.push(
    {
      id: "mirror-parent",
      title: "The child as our mirror",
      frame: "Write about what children reveal in us: our hurry, our fear, our tenderness and our growth.",
      why: "This connects strongly to Bond. Build. Become.",
    },
    {
      id: "tiny-moment",
      title: "The small moment that becomes the memory",
      frame: "Write about how ordinary moments shape a child's sense of being seen.",
      why: "It creates an emotional bridge for tired parents.",
    },
    {
      id: "repair-not-perfect",
      title: "Parents do not need perfect responses",
      frame: "Write about repair, gentleness and trying again after missing the moment.",
      why: "It lowers guilt and keeps parents open.",
    },
    {
      id: "behaviour-message",
      title: "Look beneath the behaviour",
      frame: "Write about behaviour as communication and invite parents to become curious before correcting.",
      why: "It turns a difficult parenting moment into a doorway for understanding.",
    },
    {
      id: "confidence-brushstroke",
      title: "Confidence, one brushstroke at a time",
      frame: "Connect the article to how small experiences of agency help children recognise their own capability.",
      why: "It brings the topic naturally back to the stART Studio promise.",
    },
    {
      id: "bond-build-become",
      title: "Bond first, build trust, become together",
      frame: "Shape the email through the Bond. Build. Become. journey for both child and parent.",
      why: "It gives the insight a clear emotional progression and brand connection.",
    },
    {
      id: "permission-pause",
      title: "Give parents permission to pause",
      frame: "Write to the parent who feels behind, overwhelmed or guilty, and offer one small moment of permission instead of another demand.",
      why: "It creates emotional safety and makes the message feel immediately supportive.",
    },
    {
      id: "one-small-shift",
      title: "One small shift to try today",
      frame: "Turn the article insight into one practical change a parent can try in an ordinary family moment.",
      why: "It gives the email a clear, useful takeaway without becoming instructional or heavy.",
    }
  );

  const unique = angleBank.filter(
    (angle, index, arr) => arr.findIndex((item) => item.id === angle.id) === index
  );

  return unique.slice(0, 8);
}

function makeHooks(article: Article, angle: Angle) {
  const title = angle.title.toLowerCase();
  if (title.includes("voice") || article.keywords.includes("listening")) {
    return hookPatterns;
  }

  if (title.includes("screen")) {
    return [
      "The screen is not always the real problem. Sometimes exhaustion is.",
      "Before we blame the tablet, maybe we can notice the tired parent holding everything together.",
      "Many parents do not need another screen-time lecture. They need a softer doorway back to connection.",
      "A child can have less screen time and still need more of us.",
      "The goal is not a perfect home with no screens. The goal is a home where connection still has a place.",
      "If screen time has become your quiet helper, you are not a bad parent.",
      "The question is not only 'How much screen time?' It is also 'Where can connection return?'",
      "Some battles begin with the screen. Some healing begins with five quiet minutes together.",
      "Your child may not need a dramatic rule change. They may need a small moment of being seen.",
      "Less shame creates more room for change.",
      "When parents feel judged, they close. When they feel understood, they can try again.",
      "Screens can distract a child. Shame can freeze a parent.",
    ];
  }

  if (title.includes("result") || title.includes("worth")) {
    return [
      "A child can score well and still wonder, 'Am I enough?'",
      "Sometimes the child who looks successful is the one silently asking to be seen.",
      "Results tell us what a child achieved. They do not tell us how heavy it felt.",
      "Before we ask, 'How did you do?' maybe we can ask, 'How are you holding up?'",
      "The report card is not the whole child.",
      "A child should not have to earn tenderness.",
      "Achievement becomes safer when love is not at stake.",
      "The pressure to do well can hide the need to feel well.",
      "Our children need ambition. They also need somewhere soft to land.",
      "When love feels tied to performance, even praise can feel heavy.",
      "A confident child knows they are valued before they are evaluated.",
      "The best result may be a child who still trusts their own worth.",
    ];
  }

  if (title.includes("art") || title.includes("feelings")) {
    return [
      "Some feelings come out in colour before they come out in words.",
      "A child's painting may tell us what their sentence cannot.",
      "When children create, they sometimes reveal the world they are still learning to explain.",
      "The brush can become a bridge.",
      "Art is not only about the final picture. Sometimes it is the child's way of saying, 'This is me.'",
      "A messy artwork can carry a very clear feeling.",
      "Before a child can name the emotion, they may paint it.",
      "Creativity gives children a safe place to practise being themselves.",
      "The canvas does not rush the child. Maybe that is why they open up.",
      "In art, a child can be heard without having to find the perfect words.",
      "A quiet child may still be speaking through what they make.",
      "The artwork is not the end product. The child becoming is.",
    ];
  }

  return hookPatterns.map((hook, index) =>
    index % 3 === 0 ? hook : hook.replace("child", article.title.toLowerCase().includes("children") ? "children" : "child")
  );
}

function makeEmail(article: Article, angle: Angle, hook: string, formula: Formula, style: Style) {
  const closingReflection =
    style.id === "elfin"
      ? "Perhaps the invitation is not to become a perfect parent, but to notice one moment when our child is asking to be seen."
      : style.id === "ben"
        ? "What if the smallest change is also the most powerful one: pause before we respond?"
        : style.id === "russell"
          ? "That small moment changed what I believed: connection does not require perfection; it requires presence."
          : style.id === "jaz"
            ? "If today has been difficult, please remember this: one missed moment does not undo your love. There is always another chance to reconnect."
            : style.id === "eric"
              ? "A useful place to begin is simple: notice the behaviour, name the feeling beneath it, and make room for the child’s voice."
              : "Pause. Look again. Listen to what sits beneath the words. That is often where connection begins.";

  return `Subject: ${formula.subject}

${hook}

I was reading about ${article.title.toLowerCase()}, and what stayed with me was not only the issue itself, but the parent behind it.

${article.parentConcern}

Many parents are not careless. They are tired. They are carrying work, family needs, expectations, emotions, decisions and the invisible mental load of wondering whether they are doing enough.

At stART Studio, I often see how children open up when they feel safe enough to be heard. Sometimes it happens through a painting. Sometimes through a tiny decision they are allowed to make. Sometimes through a long story that arrives at the least convenient time.

But these small moments matter.

They tell the child:

Your voice has space here.
Your ideas are worth hearing.
You do not have to be perfect to be loved.
You are allowed to become.

That is the heart of the work we do. Not just teaching art, but crafting confidence one brushstroke at a time.

${closingReflection}

If this speaks to you as a parent, pause today and notice one small moment where your child is trying to show you who they are.

It may look ordinary.

But to them, it may become memory.

${signature}`;
}

function makeVisualPrompt(article: Article, angle: Angle, hook: string, customIdea: string) {
  const base =
    customIdea.trim() ||
    `Theme: ${angle.title}

Visual idea:
A warm editorial illustration showing a parent and child in a small everyday moment connected to ${article.title}. The parent looks tired but present. The child feels expressive, safe and seen.

Use in email:
Place near the top of the email after the opening line.`;

  return `${base}

Image generation prompt:
Create a warm, funny, tender editorial-style illustration for parents.

The visual should support this email hook:
"${hook}"

The emotional message is:
${angle.frame}

Mood: relatable for tired parents, gentle humour, loving attention, expressive characters, warm colours, clean composition, suitable for an email or social post visual.

Avoid: scary mood, guilt-heavy parenting tone, cluttered text-heavy layout, stock-photo feel.`;
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] ?? character);
}

function wrapAssetText(value: string, maxLength = 30) {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    if (`${line} ${word}`.trim().length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 5);
}

function makeFacebookCardSvg(kind: "quote" | "carousel", hook: string, angle: string) {
  const lines = wrapAssetText(kind === "quote" ? hook : angle, kind === "quote" ? 29 : 25);
  const lineMarkup = lines
    .map((line, index) => `<text x="110" y="${350 + index * 82}" fill="#173f43" font-family="Georgia, serif" font-size="${kind === "quote" ? 58 : 66}" font-weight="700">${escapeXml(line)}</text>`)
    .join("");
  const eyebrow = kind === "quote" ? "A GENTLE PARENTING REMINDER" : "A stART STUDIO REFLECTION";
  const footer = kind === "quote" ? "Crafting Confidence, One Brushstroke at a Time." : "Swipe for a gentler way to see the moment  →";
  const accent = kind === "quote" ? "#d8795d" : "#e0a342";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
    <rect width="1080" height="1080" rx="0" fill="#f8f1e6"/>
    <circle cx="920" cy="150" r="180" fill="${accent}" opacity=".18"/>
    <circle cx="120" cy="955" r="210" fill="#4b8b91" opacity=".14"/>
    <path d="M820 240c65-62 142-23 142 49 0 88-142 154-142 154S678 377 678 289c0-72 77-111 142-49Z" fill="${accent}" opacity=".9"/>
    <text x="110" y="150" fill="#9b4d2c" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="5">${eyebrow}</text>
    ${lineMarkup}
    <line x1="110" y1="870" x2="970" y2="870" stroke="#d8c5b2" stroke-width="3"/>
    <text x="110" y="930" fill="#5b4939" font-family="Arial, sans-serif" font-size="27">${escapeXml(footer)}</text>
    <text x="110" y="995" fill="#173f43" font-family="Arial, sans-serif" font-size="30" font-weight="800">stART Studio</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [researchCommand, setResearchCommand] = useState("Research international news, viral social media posts, trending parenting concerns and parent worries. Find topics that can become a meaningful stART Studio main email and be repurposed across our social channels.");
  const [audience, setAudience] = useState("Tired parents who love their children but feel stretched.");
  const [mainNote, setMainNote] = useState("Write with warmth, emotional insight and a practical invitation.");
  const [customTitle, setCustomTitle] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customSummary, setCustomSummary] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState(starterArticles[4].id);
  const selectedArticle = useMemo(() => {
    if (selectedArticleId === "custom" && customTitle.trim()) {
      return {
        id: "custom",
        category: "Your article",
        title: customTitle.trim(),
        source: customUrl.trim() ? "Custom source" : "Your notes",
        url: customUrl.trim() || "https://news.google.com/",
        summary: customSummary.trim() || "Use the notes you entered as the research context.",
        parentConcern: "I want to turn this article into a meaningful message for parents.",
        emailFit: "A personalised email based on your chosen source.",
        keywords: customSummary.toLowerCase().split(/\W+/).filter(Boolean),
      } satisfies Article;
    }

    return researchArticles.find((article) => article.id === selectedArticleId) ?? researchArticles[0];
  }, [customSummary, customTitle, customUrl, selectedArticleId]);

  const angles = useMemo(() => makeAngles(selectedArticle), [selectedArticle]);
  const [angleId, setAngleId] = useState("make-space");
  const selectedAngle = angles.find((angle) => angle.id === angleId) ?? angles[0];
  const hooks = useMemo(() => makeHooks(selectedArticle, selectedAngle), [selectedArticle, selectedAngle]);
  const [hookIndex, setHookIndex] = useState(0);
  const selectedHook = hooks[hookIndex] ?? hooks[0];
  const [styleId, setStyleId] = useState("elfin");
  const selectedStyle = styles.find((style) => style.id === styleId) ?? styles[0];
  const [formulaId, setFormulaId] = useState("story");
  const selectedFormula = formulas.find((formula) => formula.id === formulaId) ?? formulas[0];
  const [visualIdea, setVisualIdea] = useState(`Theme: Make space for the child's voice
Visual idea:
A sleepy sloth parent holding a coffee cup, looking exhausted but still smiling and listening to a tiny energetic parrot child with huge sparkling eyes.

The parrot is saying:
"And then we mixed the blue with the green..."
"Then I painted the dinosaur..."
"And Uncle said..."

The sloth's thought bubble says:
"I'm exhausted..."

But underneath, the sloth is still smiling and listening.

Then the post begins:
Children don't remember how tired we were.
They remember whether we listened.

Use in email:
Place near the top of the email after the opening line.`);

  const generatedEmail = useMemo(
    () => makeEmail(selectedArticle, selectedAngle, selectedHook, selectedFormula, selectedStyle),
    [selectedArticle, selectedAngle, selectedHook, selectedFormula, selectedStyle]
  );
  const [emailDraft, setEmailDraft] = useState(() =>
    makeEmail(starterArticles[4], makeAngles(starterArticles[4])[0], hookPatterns[0], formulas[0], styles[0])
  );
  const visualPrompt = useMemo(
    () => makeVisualPrompt(selectedArticle, selectedAngle, selectedHook, visualIdea),
    [selectedArticle, selectedAngle, selectedHook, visualIdea]
  );
  const gifPrompt = useMemo(
    () => `Create a 4–6 second seamless animated GIF based on the same scene.

${visualPrompt}

Animation direction: the parrot speaks with small lively gestures, painted colour marks gently appear, the sloth blinks and smiles, and the coffee gives off a soft curl of steam. Keep motion calm, expressive and loopable. No text or watermark.`,
    [visualPrompt]
  );
  const facebookQuoteAsset = useMemo(
    () => makeFacebookCardSvg("quote", selectedHook, selectedAngle.title),
    [selectedHook, selectedAngle.title]
  );
  const facebookCarouselAsset = useMemo(
    () => makeFacebookCardSvg("carousel", selectedHook, selectedAngle.title),
    [selectedHook, selectedAngle.title]
  );
  const facebookCompany = `FACEBOOK COMPANY POST

${selectedHook}

${emailDraft.split("\n").slice(3, 11).join("\n")}

At stART Studio, we believe confidence is crafted one brushstroke at a time. When children feel seen, heard and trusted, they begin to recognise their own worth.

What small moment helped you connect with your child this week?

#stARTStudio #CraftingConfidence #ParentingWithConnection`;
  const facebookPersonal = `I had a small reminder today.

${selectedHook}

${emailDraft.split("\n").slice(5, 14).join("\n")}

This is something I keep learning too: children often become our mirror. They show us where we are hurried, where we are tender, and where we are still growing.

— Elfin`;
  const instagramPersonal = `${selectedHook}

Sometimes the ordinary moments are the ones that shape a child's sense of being seen.

Pause. Listen. Notice.

Your child's voice has space here.
Their ideas are worth hearing.
They do not have to be perfect to be loved.

Save this for the day parenting feels especially full. 🤍

#parentingreflection #childconfidence #connectionbeforecorrection #startstudio`;
  const linkedInProfessional = `What creative education teaches us about leadership and human development

${selectedHook}

The same conditions that help a child grow also strengthen healthy teams: psychological safety, room to try, respect for individual voice, and guidance without humiliation.

At stART Studio, art is not only the output. It is a practice ground for agency, resilience and self-worth.

The professional question worth considering is this:

Are we creating environments where people merely perform—or where they also become?

Elfin
Founder, stART Studio | Author, Bond. Build. Become.`;
  const tiktokScript = `TIKTOK SCRIPT · 45–60 SECONDS

ON-SCREEN HOOK
${selectedHook}

SHOT 1 · CLOSE-UP, SPEAKING TO CAMERA
"Can I share something I nearly missed as a parent and educator?"

SHOT 2 · CUTAWAY TO THE VISUAL OR A CHILD PAINTING
"Sometimes a child's longest, most excited story arrives exactly when we are tired, distracted, or trying to finish something."

SHOT 3 · BACK TO CAMERA
"But before children tell us the big things, they often test us with the small things—the painting, the dinosaur, the colour they mixed."

SHOT 4 · GENTLE PAUSE
"When we listen, we are not only hearing a story. We are telling the child: your voice matters here."

SHOT 5 · CTA
"Today, give your child five unhurried minutes. You may be surprised by what opens up."

ON-SCREEN END LINE
Crafting Confidence, One Brushstroke at a Time.

CAPTION
The ordinary stories are often where trust begins. Save this for a tired parenting day.

#ParentingTikTok #ChildConfidence #ConnectionBeforeCorrection #stARTStudio`;
  const youtubeScript = `YOUTUBE VIDEO SCRIPT · 5–7 MINUTES

VIDEO TITLE
Why Your Child Talks Most When You Are Tired

THUMBNAIL LINE
The Small Stories Matter

OPENING SHOT · 0:00–0:20
CAMERA: Medium close-up. Warm studio background. Hold a cup or paintbrush.

ELFIN:
"Have you noticed that children often choose the most inconvenient moment to tell us their longest story? You are tired, your mind is full—and suddenly they need to explain every colour, every character and every tiny detail."

B-ROLL: Close shots of brushes, a child mixing blue and green, animated parrot-and-sloth visual.

HOOK AND PROMISE · 0:20–0:45
ELFIN:
"It can sound like a story about nothing. But to the child, it may be a quiet question: Do you have space for me? In this video, I want to show you why these ordinary conversations matter—and how five minutes of listening can build confidence."

SECTION 1 · WHAT THE CHILD IS REALLY ASKING · 0:45–2:00
CAMERA: Seated, direct to camera.

ELFIN:
"Before children trust us with the big things, they often test the relationship with small things. They tell us about the painting, the dinosaur, the game or what somebody said at school. They are watching our face. They are learning whether their thoughts are welcome."

ON-SCREEN TEXT:
Your voice has space here.

SECTION 2 · THE TIRED PARENT'S REALITY · 2:00–3:15
B-ROLL: Parent finishing work, preparing dinner, putting down a phone.

ELFIN:
"This is not about blaming tired parents. Most parents are carrying far more than children can see. Connection does not require us to be endlessly available. It asks us to recognise a few moments worth protecting."

SECTION 3 · A SIMPLE PRACTICE · 3:15–4:45
CAMERA: Slightly closer framing.

ELFIN:
"Try this: stop for five minutes, turn your body towards your child, and ask one curious follow-up question. You might say, 'What happened next?' or 'Which part did you like most?' You do not need to solve, teach or correct. Just stay with the story."

ON-SCREEN STEPS:
1. Pause
2. Turn towards them
3. Ask one curious question
4. Listen without fixing

SECTION 4 · THE DEEPER MEANING · 4:45–5:45
B-ROLL: Child painting freely; adult watching without correcting.

ELFIN:
"Every time a child's ordinary story is treated as worth hearing, they receive a message about themselves: My ideas matter. I am allowed to express who I am. I do not have to be perfect to be loved."

CLOSING · 5:45–6:30
CAMERA: Direct, warm eye contact.

ELFIN:
"Today, notice one small moment when your child is trying to show you who they are. It may look ordinary. But to them, it may become memory."

CTA:
"If this reflection helped you, subscribe and share it with another parent who may need a gentler reminder today."

END CARD
Elfin · stART Studio
Crafting Confidence, One Brushstroke at a Time.`;

  function chooseArticle(id: string) {
    setSelectedArticleId(id);
    const nextArticle =
      id === "custom" && customTitle.trim()
        ? ({
            id: "custom",
            category: "Your article",
            title: customTitle.trim(),
            source: customUrl.trim() ? "Custom source" : "Your notes",
            url: customUrl.trim() || "https://news.google.com/",
            summary: customSummary.trim() || "Use the notes you entered as the research context.",
            parentConcern: "I want to turn this article into a meaningful message for parents.",
            emailFit: "A personalised email based on your chosen source.",
            keywords: customSummary.toLowerCase().split(/\W+/).filter(Boolean),
          } satisfies Article)
        : researchArticles.find((article) => article.id === id) ?? researchArticles[0];
    const nextAngles = makeAngles(nextArticle);
    setAngleId(nextAngles[0].id);
    setHookIndex(0);
  }

  function chooseAngle(id: string) {
    setAngleId(id);
    setHookIndex(0);
  }

  return (
    <main className="dashboard-root min-h-screen bg-[#f8f4ed] text-[#261b13]">
      <section className="app-shell mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="app-header flex flex-col gap-4 border-b border-[#ddcdbb] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b4d2c]">
              stART Studio
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Email Engine
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6d5b4a]">
              Research one strong topic, write the main email, create its visual and repurpose it for every channel.
            </p>
          </div>
          <div className="rounded-lg border border-[#ddcdbb] bg-white/70 px-4 py-3 text-sm text-[#5b4939]">
            Final signature is locked to Elfin and stART Studio.
          </div>
        </header>

        <nav className="workflow-nav grid gap-2 py-5 sm:grid-cols-3 lg:grid-cols-6">
          {[
            "Research",
            "Topics",
            "Angle + Hook",
            "Main Email",
            "Email Visual",
            "FB Company",
            "FB Asset",
            "FB Personal",
            "Instagram",
            "LinkedIn",
            "TikTok",
            "YouTube",
          ].map((label, index) => (
            <button
              key={label}
              onClick={() => setStep(index + 1)}
              className={`rounded-lg border px-3 py-3 text-left text-sm font-semibold transition ${
                step === index + 1
                  ? "border-[#9b4d2c] bg-[#9b4d2c] text-white"
                  : "border-[#ddcdbb] bg-white/80 text-[#5b4939] hover:border-[#b36b44]"
              }`}
            >
              <span className="block text-xs opacity-75">Page {index + 1}</span>
              {label}
            </button>
          ))}
        </nav>

        <section className="dashboard-page flex-1 rounded-lg border border-[#ddcdbb] bg-white p-4 shadow-sm sm:p-6">
          {step === 1 && (
            <div className="page-shell page-one space-y-6">
              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                <p className="section-kicker">Page 1</p>
                <h2 className="section-title">Research Command Centre</h2>
                <p className="section-copy">
                  Send one command to both research agents. They scan the wider conversation, then pass strong possibilities to the Topic Decision Agent.
                </p>
                </div>
                <div className="grid gap-4">
                  <label className="field">
                    <span>Research command</span>
                    <textarea value={researchCommand} onChange={(event) => setResearchCommand(event.target.value)} rows={7} />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="agent-card"><span>AGENT 01</span><strong>News Research Agent</strong><p>International news, emerging stories and viral social conversations.</p></div>
                    <div className="agent-card"><span>AGENT 02</span><strong>Parent Concern Scanner</strong><p>Trending parenting concerns, worries, questions and emotional pressure points.</p></div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="field">
                  <span>Core audience</span>
                  <textarea value={audience} onChange={(event) => setAudience(event.target.value)} rows={3} />
                </label>
                <label className="field">
                  <span>Main writing note</span>
                  <textarea value={mainNote} onChange={(event) => setMainNote(event.target.value)} rows={3} />
                </label>
              </div>
              <button className="primary-button" onClick={() => setStep(2)}>
                Run research and view 12 topics →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="page-shell page-two space-y-5">
              <div>
                <p className="section-kicker">Page 2</p>
                <h2 className="section-title">Browse Research Results</h2>
                <p className="section-copy">
                  The Topic Decision Agent has arranged 12 research articles in a three-column grid. Select one article, or open its source before deciding.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {researchArticles.map((article) => (
                  <article
                    key={article.id}
                    className={`result-card ${selectedArticle.id === article.id ? "selected-card" : ""}`}
                  >
                    <button onClick={() => chooseArticle(article.id)} className="card-button">
                      <span className="pill">{article.category}</span>
                      <h3>{article.title}</h3>
                      <p>{article.summary}</p>
                      <strong>Parent concern</strong>
                      <p>{article.parentConcern}</p>
                    </button>
                    <a href={article.url} target="_blank" rel="noreferrer" className="source-link">
                      Read source: {article.source}
                    </a>
                    <button className="card-next" onClick={() => { chooseArticle(article.id); setStep(3); }}>
                      Choose this topic →
                    </button>
                  </article>
                ))}
              </div>
              <div className="custom-box">
                <div>
                  <p className="section-kicker">Use your own article</p>
                  <h3 className="text-xl font-semibold">Paste an article you found</h3>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <label className="field">
                    <span>Article title</span>
                    <input value={customTitle} onChange={(event) => setCustomTitle(event.target.value)} />
                  </label>
                  <label className="field">
                    <span>Direct article link</span>
                    <input value={customUrl} onChange={(event) => setCustomUrl(event.target.value)} />
                  </label>
                </div>
                <label className="field">
                  <span>Paste article notes or summary</span>
                  <textarea value={customSummary} onChange={(event) => setCustomSummary(event.target.value)} rows={4} />
                </label>
                <button className="primary-button" onClick={() => chooseArticle("custom")} disabled={!customTitle.trim()}>
                  Use this article
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="page-shell page-three space-y-5">
              <div>
                <p className="section-kicker">Page 3</p>
                <h2 className="section-title">Choose Article Angle and Hook</h2>
                <p className="section-copy">
                  Choose an angle on the left. The Hook Agent will immediately shape 12 opening options for that direction on the right.
                </p>
              </div>
              <SelectedSource article={selectedArticle} />
              <div className="angle-hook-layout">
                <section className="choice-column angle-choice-column">
                  <div className="column-heading"><h3>stART Studio Angle Agent</h3><p>Choose one of eight directions.</p></div>
                  <div className="angle-list grid gap-3">
                    {angles.map((angle) => (
                      <button key={angle.id} onClick={() => chooseAngle(angle.id)} className={`angle-card ${selectedAngle.id === angle.id ? "selected-card" : ""}`}>
                        <h3>{angle.title}</h3>
                        <p>{angle.frame}</p>
                        <strong>{angle.why}</strong>
                      </button>
                    ))}
                  </div>
                </section>
                <section className="choice-column hook-choice-column">
                  <div className="column-heading"><h3>Hook Agent</h3><p>Choose one of 12 attention-grabbing openings.</p></div>
                  <div className="hook-list grid gap-3">
                    {hooks.map((hook, index) => (
                      <button key={hook} onClick={() => setHookIndex(index)} className={`hook-card ${hookIndex === index ? "selected-card" : ""}`}>
                        <span>Hook {index + 1}</span>
                        <p>{hook}</p>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
              <div className="page-actions"><button className="primary-button" onClick={() => setStep(4)}>Angle and hook chosen — write email →</button></div>
            </div>
          )}

          {step === 4 && (
            <div className="page-shell page-four space-y-7">
              <div>
                <p className="section-kicker">Page 4 · Email Copy Agent</p>
                <h2 className="section-title">Create the Main Email</h2>
                <p className="section-copy">
                  First choose how the argument should flow. Then choose the voice. Generate the draft and edit it directly until it feels ready.
                </p>
              </div>
              <div className="email-choice-layout">
                <section className="choice-column email-choice-column">
                  <div className="column-heading"><h3>6 Ways to Write</h3><p>Choose the writing structure that shapes the journey of the email.</p></div>
                  <div className="balanced-choice-list">
                    {formulas.map((formula) => (
                      <button key={formula.id} onClick={() => setFormulaId(formula.id)} className={`formula-card compact ${selectedFormula.id === formula.id ? "selected-card" : ""}`}>
                        <span>{formula.label}</span>
                        <strong>{formula.name}</strong>
                        <p>{formula.description}</p>
                        <b>Subject direction: {formula.subject}</b>
                        {selectedFormula.id === formula.id && <em>Chosen</em>}
                      </button>
                    ))}
                  </div>
                </section>
                <section className="choice-column email-choice-column">
                  <div className="column-heading"><h3>6 Writing Styles</h3><p>Choose the voice, emotional tone and reading rhythm.</p></div>
                  <div className="balanced-choice-list">
                    {styles.map((style) => (
                      <button key={style.id} onClick={() => setStyleId(style.id)} className={`style-card expanded ${selectedStyle.id === style.id ? "selected-card" : ""}`}>
                        <strong>{style.name}</strong>
                        <span>{style.description}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="chosen-strip">
                  <span>Audience</span>
                  <strong>{audience}</strong>
                </div>
                <div className="chosen-strip">
                  <span>Main note</span>
                  <strong>{mainNote}</strong>
                </div>
              </div>
              <button className="primary-button" onClick={() => setEmailDraft(generatedEmail)}>
                Generate publish-ready main email
              </button>
              <label className="field">
                <span>Publish-ready email — edit directly if needed</span>
                <textarea className="draft-box publish-ready" value={emailDraft} onChange={(event) => setEmailDraft(event.target.value)} />
              </label>
              <div className="page-actions"><button className="primary-button" onClick={() => setStep(5)}>Email ready — create visual →</button></div>
            </div>
          )}

          {step === 5 && (
            <div className="page-shell page-five space-y-6">
              <div><p className="section-kicker">Page 5 · Visual Creation</p><h2 className="section-title">Create Email Visual</h2><p className="section-copy">Use the still image or animated GIF with your main email. Both visual formats remain available together.</p></div>
              <label className="field"><span>Shared visual idea</span><textarea value={visualIdea} onChange={(event) => setVisualIdea(event.target.value)} rows={8} /></label>
              <div className="visual-creation-grid">
                <section className="visual-creation-card">
                  <div className="column-heading"><h3>Still Image</h3><p>Prompt and generated downloadable image.</p></div>
                  <textarea className="visual-prompt-box" value={visualPrompt} readOnly />
                  <div className="generated-visual"><img src={`${import.meta.env.BASE_URL}email-still.png`} alt="Generated editorial illustration of a sloth parent listening to a parrot child" /></div>
                  <a className="download-button" href={`${import.meta.env.BASE_URL}email-still.png`} download="start-studio-email-visual.png">Download still image</a>
                </section>
                <section className="visual-creation-card">
                  <div className="column-heading"><h3>Animated GIF</h3><p>Motion prompt and generated downloadable GIF.</p></div>
                  <textarea className="visual-prompt-box" value={gifPrompt} readOnly />
                  <div className="generated-visual"><img src={`${import.meta.env.BASE_URL}email-visual.gif`} alt="Animated editorial GIF of a sloth parent listening to a parrot child" /></div>
                  <a className="download-button" href={`${import.meta.env.BASE_URL}email-visual.gif`} download="start-studio-email-visual.gif">Download animated GIF</a>
                </section>
              </div>
              <div className="page-actions"><button className="primary-button" onClick={() => setStep(6)}>Continue to Facebook Company →</button></div>
            </div>
          )}

          {step === 6 && (
            <RepurposePage page="Page 6" agent="Facebook Company Agent" title="Repurpose for Facebook Company" description="Turn the main email into a warm, useful brand post with a conversation-opening CTA." content={facebookCompany} nextLabel="Create Facebook asset" onNext={() => setStep(7)} />
          )}

          {step === 7 && (
            <div className="channel-page page-shell page-seven">
              <div><p className="section-kicker">Page 7 · Facebook Asset Agent</p><h2 className="section-title">Create Four Facebook Assets</h2><p className="section-copy">Each publish-ready direction has its own production prompt and a separate downloadable visual. Use one strong asset with the Facebook Company caption, or test different formats across future posts.</p></div>
              <div className="facebook-assets-grid">
                <article className="facebook-asset-card">
                  <div className="facebook-prompt-area">
                    <span>Asset 1 · Editorial Illustration</span>
                    <textarea value={`Create a square 1080 × 1080 editorial illustration for a Facebook company post.

Scene: A warm, expressive sloth parent sits on a cream sofa, visibly tired but lovingly attentive, while an excited colourful parrot child talks animatedly beside them.

Action: Add many playful empty speech bubbles and hand-drawn action marks around the parrot to show rapid excited chatter. The sloth holds a warm drink, gently smiles and keeps listening.

Message to express: ${selectedHook}
Core direction: ${selectedAngle.frame}

Style: textured hand-painted editorial illustration; warm cream, deep teal, gentle coral and mustard; emotionally safe, humorous and polished.
Composition: clear focal point, generous breathing room, mobile-feed readability.
Avoid: written words, logos, watermark, guilt, judgement, clutter or stock-photo styling.`} readOnly />
                  </div>
                  <div className="facebook-asset-preview"><img src={`${import.meta.env.BASE_URL}email-still.png`} alt="Facebook editorial illustration featuring a sloth parent and excited parrot child" /></div>
                  <a className="download-button" href={`${import.meta.env.BASE_URL}email-still.png`} download="start-studio-facebook-editorial.png">Download editorial illustration</a>
                </article>

                <article className="facebook-asset-card">
                  <div className="facebook-prompt-area">
                    <span>Asset 2 · Branded Quote Card</span>
                    <textarea value={`Create a square 1080 × 1080 branded quote card for stART Studio.

Use this exact quote:
"${selectedHook}"

Design: Warm cream background, deep teal editorial typography, gentle coral heart-shaped accent, subtle teal and coral organic circles, generous margins and a fine divider near the footer.

Footer:
stART Studio
Crafting Confidence, One Brushstroke at a Time.

Feeling: thoughtful, calm, premium, emotionally safe and immediately readable on a phone.
Avoid: photography, tiny type, crowded decoration, extra messaging, watermark or misspelled words.`} readOnly />
                  </div>
                  <div className="facebook-asset-preview"><img src={facebookQuoteAsset} alt="Publish-ready stART Studio Facebook quote card" /></div>
                  <a className="download-button" href={facebookQuoteAsset} download="start-studio-facebook-quote-card.svg">Download quote card</a>
                </article>

                <article className="facebook-asset-card">
                  <div className="facebook-prompt-area">
                    <span>Asset 3 · Carousel Cover</span>
                    <textarea value={`Create the cover of a five-slide square Facebook carousel, 1080 × 1080.

Cover headline:
"${selectedAngle.title}"

Supporting cue:
"Swipe for a gentler way to see the moment →"

Visual system: warm cream background, deep teal headline, mustard and coral organic shapes, one friendly heart motif and elegant editorial spacing.

The next four slides should unfold:
1. The familiar parent struggle
2. What may sit beneath the child's behaviour
3. One belief shift
4. One small action and a gentle stART Studio CTA

Keep every slide concise, consistent, legible on mobile and ready for a professional Facebook company account.
Avoid: dense paragraphs, inconsistent colours, stock icons, guilt or judgement.`} readOnly />
                  </div>
                  <div className="facebook-asset-preview"><img src={facebookCarouselAsset} alt="Publish-ready cover for a stART Studio Facebook carousel" /></div>
                  <a className="download-button" href={facebookCarouselAsset} download="start-studio-facebook-carousel-cover.svg">Download carousel cover</a>
                </article>

                <article className="facebook-asset-card">
                  <div className="facebook-prompt-area">
                    <span>Asset 4 · Animated Facebook GIF</span>
                    <textarea value={`Create a seamless 4–6 second square animated GIF for Facebook, based on the sloth parent and parrot child scene.

Motion sequence: The colourful parrot child bounces gently, moves its wings and talks excitedly. Several empty speech bubbles pop up one after another with lively drawn action marks. The tired sloth parent blinks slowly, lifts the warm cup, then smiles. A soft curl of steam completes the loop.

Message to express: ${selectedHook}
Core direction: ${selectedAngle.frame}

Style: textured hand-painted editorial animation; warm cream, deep teal, gentle coral and mustard; playful but not frantic.
Technical: square 1080 × 1080, seamless loop, clear motion at small mobile size.
Avoid: written text, flashing, abrupt cuts, logos, watermark, guilt or judgement.`} readOnly />
                  </div>
                  <div className="facebook-asset-preview"><img src={`${import.meta.env.BASE_URL}email-visual.gif`} alt="Animated Facebook visual featuring a sloth parent and parrot child" /></div>
                  <a className="download-button" href={`${import.meta.env.BASE_URL}email-visual.gif`} download="start-studio-facebook-animated.gif">Download animated GIF</a>
                </article>
              </div>
              <div className="page-actions"><button className="primary-button" onClick={() => setStep(8)}>Continue to Facebook Personal →</button></div>
            </div>
          )}

          {step === 8 && (
            <RepurposePage page="Page 8" agent="Personal Voice Agent" title="Repurpose for Facebook Personal" description="Make the idea sound like Elfin sharing a personal reflection, not a company announcement." content={facebookPersonal} nextLabel="Continue to Instagram" onNext={() => setStep(9)} />
          )}

          {step === 9 && (
            <RepurposePage page="Page 9" agent="Instagram Personal Agent" title="Repurpose for Instagram Personal" description="Create a concise, saveable reflection with an emotionally clear opening and natural hashtags." content={instagramPersonal} nextLabel="Continue to LinkedIn" onNext={() => setStep(10)} />
          )}

          {step === 10 && (
            <RepurposePage page="Page 10" agent="LinkedIn Professional Agent" title="Repurpose for LinkedIn Professional" description="Translate the parenting insight into a thoughtful professional perspective on leadership, education and human development." content={linkedInProfessional} nextLabel="Continue to TikTok" onNext={() => setStep(11)} />
          )}

          {step === 11 && (
            <RepurposePage page="Page 11" agent="TikTok Script Agent" title="Repurpose for TikTok" description="Turn the main email into a concise vertical-video script with spoken lines, shot guidance, on-screen text and a natural CTA." content={tiktokScript} nextLabel="Continue to YouTube" onNext={() => setStep(12)} />
          )}

          {step === 12 && (
            <RepurposePage page="Page 12" agent="YouTube Script Agent" title="Repurpose for YouTube" description="Create a complete filming script with timing, camera direction, B-roll, spoken delivery, on-screen text, title, thumbnail line and CTA." content={youtubeScript} nextLabel="Return to research" onNext={() => setStep(1)} />
          )}
        </section>
      </section>
    </main>
  );
}

function SelectedSource({ article }: { article: Article }) {
  return (
    <div className="selected-source">
      <span>{article.category}</span>
      <strong>{article.title}</strong>
      <p>{article.summary}</p>
      <a href={article.url} target="_blank" rel="noreferrer">
        Open source
      </a>
    </div>
  );
}

function RepurposePage({ page, agent, title, description, content, nextLabel, onNext }: { page: string; agent: string; title: string; description: string; content: string; nextLabel: string; onNext: () => void }) {
  const [draft, setDraft] = useState(content);
  return (
    <div className="channel-page page-shell repurpose-page">
      <div><p className="section-kicker">{page} · {agent}</p><h2 className="section-title">{title}</h2><p className="section-copy">{description}</p></div>
      <div className="channel-tools">
        <div className="chosen-strip"><span>Source email</span><strong>{content.split("\n")[0]}</strong></div>
        <button className="secondary-button" onClick={() => setDraft(content)}>Regenerate from main email</button>
      </div>
      <label className="field channel-output"><span>Generated text — edit directly if needed</span><textarea className="draft-box" value={draft} onChange={(event) => setDraft(event.target.value)} /></label>
      <div className="page-actions"><button className="primary-button" onClick={onNext}>{nextLabel} →</button></div>
    </div>
  );
}
