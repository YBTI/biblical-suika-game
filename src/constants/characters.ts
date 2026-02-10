export interface Character {
  level: number;
  name: string;
  radius: number;
  color: string;
  score: number;
  image: string;
}

export const CHARACTERS: Character[] = [
  { level: 1, name: "アダム", radius: 20, color: "#8B4513", score: 1, image: "/character/アダム.png" },
  { level: 2, name: "ノア", radius: 30, color: "#D2691E", score: 3, image: "/character/ノア.png" },
  { level: 3, name: "アブラハム", radius: 40, color: "#CD853F", score: 6, image: "/character/アブラハム.png" },
  { level: 4, name: "イサク", radius: 50, color: "#F4A460", score: 10, image: "/character/イサク.png" },
  { level: 5, name: "ヤコブ", radius: 60, color: "#DEB887", score: 15, image: "/character/ヤコブ.png" },
  { level: 6, name: "ヨセフ", radius: 70, color: "#BC8F8F", score: 21, image: "/character/ヨセフ.png" },
  { level: 7, name: "モーセ", radius: 80, color: "#A0522D", score: 28, image: "/character/モーセ.png" },
  { level: 8, name: "ヨシュア", radius: 90, color: "#D2B48C", score: 36, image: "/character/ヨシュア.png" },
  { level: 9, name: "ギデオン", radius: 100, color: "#F5DEB3", score: 45, image: "/character/ギデオン.png" },
  { level: 10, name: "サムソン", radius: 110, color: "#FFE4B5", score: 55, image: "/character/サムソン.png" },
  { level: 11, name: "サムエル", radius: 120, color: "#FFEFD5", score: 66, image: "/character/サムエル.png" },
  { level: 12, name: "サウル", radius: 130, color: "#FFF8DC", score: 78, image: "/character/サウル.png" },
  { level: 13, name: "ダビデ", radius: 140, color: "#FFEBCD", score: 91, image: "/character/ダビデ.png" },
  { level: 14, name: "ソロモン", radius: 150, color: "#FFDEAD", score: 105, image: "/character/ソロモン.png" },
  { level: 15, name: "イザヤ", radius: 160, color: "#FAFAD2", score: 120, image: "/character/イザヤ.png" },
  { level: 16, name: "エリヤ", radius: 170, color: "#FFFACD", score: 136, image: "/character/エリヤ.png" },
  { level: 17, name: "ヨブ", radius: 180, color: "#FFFFE0", score: 153, image: "/character/ヨブ.png" },
  { level: 18, name: "イエス・キリスト", radius: 200, color: "#FFD700", score: 200, image: "/character/イエス・キリスト.png" },
];
