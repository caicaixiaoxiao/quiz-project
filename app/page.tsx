"use client";

import { useState } from "react";
import Image from "next/image";

type PersonalityId = "bold" | "cozy" | "indulgent";

interface Question {
  text: string;
  options: { text: string; personality: PersonalityId }[];
}

interface Personality {
  id: PersonalityId;
  name: string;
  coffee: string;
  tagline: string;
  image: string;
  description: string;
}

const questions: Question[] = [
  {
    text: "周末突然有一整天自由，你第一反应是？",
    options: [
      { text: "立刻查有什么新地方可以去探索", personality: "bold" },
      { text: "太好了，终于可以窝着什么都不做", personality: "cozy" },
      { text: "想想去哪里吃顿好的或买点什么犒劳自己", personality: "indulgent" },
    ],
  },
  {
    text: "你更像哪种旅行者？",
    options: [
      { text: "背包客，目的地越偏越好", personality: "bold" },
      { text: "提前订好酒店，行程留白，走到哪是哪", personality: "cozy" },
      { text: "酒店必须五星，吃喝玩乐全要最好的", personality: "indulgent" },
    ],
  },
  {
    text: "如果你是一种天气……",
    options: [
      { text: "雷雨天——刺激、有力量感", personality: "bold" },
      { text: "阴天微风——舒适、不张扬", personality: "cozy" },
      { text: "第一场雪——美好、值得好好感受", personality: "indulgent" },
    ],
  },
  {
    text: "朋友让你推荐一部电影，你会选？",
    options: [
      { text: "最近很火的动作冒险片，肾上腺素拉满", personality: "bold" },
      { text: "老片子，看过好几遍但每次都很治愈", personality: "cozy" },
      { text: "画面精美的美食或生活方式纪录片", personality: "indulgent" },
    ],
  },
  {
    text: "工作压力很大的一天结束后，你最想……",
    options: [
      { text: "去健身或夜跑，用运动发泄掉", personality: "bold" },
      { text: "换上睡衣，泡杯热饮，彻底放空", personality: "cozy" },
      { text: "点一份平时舍不得吃的外卖好好奖励自己", personality: "indulgent" },
    ],
  },
];

const personalities: Record<PersonalityId, Personality> = {
  bold: {
    id: "bold",
    name: "大胆冒险者",
    coffee: "双份浓缩 Double Espresso",
    tagline: "你活在极致里",
    image: "/espresso.jpg",
    description: "你不做任何事都是全力以赴。生活要过得有强度，咖啡也一样——纯粹、浓烈、毫不妥协。",
  },
  cozy: {
    id: "cozy",
    name: "温暖守旧派",
    coffee: "中焙滴滤咖啡 Medium Roast Drip",
    tagline: "每一杯都是安慰",
    image: "/drip-coffee.jpg",
    description: "你知道什么让你快乐，而且不需要别人认可。稳定、踏实、有温度——就像一杯刚好的咖啡。",
  },
  indulgent: {
    id: "indulgent",
    name: "放纵享受者",
    coffee: "摩卡加奶油 Mocha with Whip",
    tagline: "咖啡就是甜点",
    image: "/mocha.jpg",
    description: "人生苦短，该享受的时候不手软。你懂得犒劳自己，也懂得生活里小小的奢侈有多治愈。",
  },
};

function calculateResult(answers: PersonalityId[]): PersonalityId {
  const counts: Record<PersonalityId, number> = { bold: 0, cozy: 0, indulgent: 0 };
  answers.forEach((a) => counts[a]++);
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as PersonalityId);
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<PersonalityId[]>([]);
  const [result, setResult] = useState<PersonalityId | null>(null);

  const handleAnswer = (personality: PersonalityId) => {
    const newAnswers = [...answers, personality];
    if (current + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
    } else {
      setResult(calculateResult(newAnswers));
    }
  };

  const reset = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  };

  // 结果页
  if (result) {
    const p = personalities[result];
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-sm shadow-sm p-10 max-w-md w-full">
          {/* 顶部小标签 */}
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-8 text-center">你的咖啡性格</p>

          {/* 主角：性格名 + 头像并排 */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-50">
              <Image
                src={p.image}
                alt={p.coffee}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900 leading-tight">{p.name}</h1>
              <p className="text-sm text-gray-400 italic mt-1">{p.tagline}</p>
            </div>
          </div>

          {/* 推荐咖啡高亮色块 */}
          <div className="bg-gray-50 rounded px-4 py-3 mb-6">
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">推荐咖啡</p>
            <p className="text-base font-medium text-gray-800">{p.coffee}</p>
          </div>

          {/* 描述文字，左对齐 */}
          <p className="text-sm text-gray-500 leading-relaxed mb-8">{p.description}</p>

          <button
            onClick={reset}
            className="text-xs text-gray-400 hover:text-gray-700 tracking-widest uppercase transition-colors"
          >
            重新测一次 →
          </button>
        </div>
      </main>
    );
  }

  // 题目页
  const q = questions[current];
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-sm shadow-sm p-10 max-w-md w-full">
        {/* 进度条 */}
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">
          问题 {current + 1} / {questions.length}
        </p>
        <div className="flex gap-1 mb-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 transition-colors ${i <= current ? "bg-gray-900" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <h2 className="text-xl text-gray-900 mb-8 leading-relaxed font-normal">{q.text}</h2>

        <div className="divide-y divide-gray-100">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.personality)}
              className="w-full flex items-center justify-between py-4 text-left text-sm text-gray-500 hover:text-gray-900 transition-colors group"
            >
              <span>{opt.text}</span>
              <span className="text-gray-300 group-hover:text-gray-700 transition-colors ml-4">→</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
