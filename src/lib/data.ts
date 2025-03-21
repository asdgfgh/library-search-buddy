
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
  available: boolean;
  image?: string;
}

export const books: Book[] = [
  {
    id: "1",
    title: "Эстетические отношения искусства к действительности",
    author: "Н.Г. Чернышевский",
    year: 1955,
    genre: "Філософія",
    description: "Москва, Гос. изд-во Худ. л-ры, 221 с.",
    available: true
  },
  {
    id: "2",
    title: "Твоей разумной силе слава!",
    author: "Збірник",
    year: 1988,
    genre: "Збірка",
    description: "Москва, Книга, 256 с., 5-212-00028-9",
    available: true
  },
  {
    id: "3",
    title: "Музыкально-историческое наследие. Вывуск 5",
    author: "Ромен Роллан",
    year: 1990,
    genre: "Музикознавство",
    description: "Жизнь Бетховена. Бетховен. Великие творческие эпохи. От \"Героической\" до \"Аппассионаты\". Москва, Музыка, 285 с.",
    available: true
  },
  {
    id: "4",
    title: "Фортепианное наследие Чайковского",
    author: "А. Николаев",
    year: 1949,
    genre: "Музикознавство",
    description: "Москва, Ленинград, Гос. Муз. изд-во, 207 с., M-Ц Н63",
    available: true
  },
  {
    id: "5",
    title: "Романсы Чайковского",
    author: "Е. Орлова",
    year: 1948,
    genre: "Музикознавство",
    description: "Москва, Ленинград, ГОС. МУЗ. ИЗД-ВО, 163с., М О-66",
    available: true
  },
  {
    id: "6",
    title: "С. Гулак-Артемовський",
    author: "Л. Кауфман",
    year: 1962,
    genre: "Біографія",
    description: "Київ, Держ.вид-во Образотворчого мистецтва і музичної літератури УРСР, 192с., М К-30",
    available: true
  },
  {
    id: "7",
    title: "Мария Литвиненко-Вольгемут",
    author: "Т. Швачко",
    year: 1986,
    genre: "Біографія",
    description: "Киев, Музична Украина, 136с., М Ш-33",
    available: true
  },
  {
    id: "8",
    title: "Лунная соната Бетховена",
    author: "С. Хентова",
    year: 1988,
    genre: "Музикознавство",
    description: "Москва, Музыка, 32с., М Х-38, 5-7140-0189-3",
    available: true
  },
  {
    id: "9",
    title: "50 опер. История создания. Сюжет. Музыка",
    author: "М. Друскин",
    year: 1959,
    genre: "Довідник",
    description: "Ленинград, Советсикй композитор, 328с., М П99",
    available: true
  },
  {
    id: "10",
    title: "Оперы Дж. Верди",
    author: "Збірник",
    year: 1971,
    genre: "Музикознавство",
    description: "Москва, Изд-во Музыка, 420с., М О-60",
    available: false
  },
  {
    id: "11",
    title: "Василий Сергеевич Калинников. Жизнь и творчество",
    author: "Вяч. Пасхалов",
    year: 1951,
    genre: "Біографія",
    description: "Ленингшрад-Москва, Гос. муз. изд-во, М П19",
    available: true
  },
  {
    id: "12",
    title: "Дневники. 1903-1909",
    author: "С. Танеев",
    year: 1985,
    genre: "Щоденники",
    description: "Москва, Музыка, 560с., М Т18",
    available: true
  },
  {
    id: "13",
    title: "Н. М. Мясковский. Творческий путь",
    author: "Т. Ливанова",
    year: 1953,
    genre: "Біографія",
    description: "Москва, Гос. муз. изд-во, 407с., М Л55",
    available: false
  },
  {
    id: "14",
    title: "Материалы и документы. Переписка и воспоминапния",
    author: "С.И. Танеев",
    year: 1952,
    genre: "Документи",
    description: "Москва, Изд-во Академии наук СССР, 353с.",
    available: true
  },
  {
    id: "15",
    title: "Справочник-путеводитель по симфониям Н.Я. Мясковского",
    author: "В. Виноградов",
    year: 1954,
    genre: "Довідник",
    description: "Москва, Гос.муз.изд-во, 204с.",
    available: true
  },
  {
    id: "16",
    title: "Избранные статьи",
    author: "Ц.А. Кюи",
    year: 1952,
    genre: "Збірка статей",
    description: "Ленинград, Гос.муз.изд-во, 691с., М К99",
    available: true
  },
  {
    id: "17",
    title: "А.К. Лядов. Жизнь и творчество",
    author: "Н. Запорожец",
    year: 1954,
    genre: "Біографія",
    description: "Москва, Гос.муз.изд-во, 213с., М З-30",
    available: true
  },
  {
    id: "18",
    title: "Дмитрий Борисович Кабалевский",
    author: "Г. Пожидаев",
    year: 1984,
    genre: "Біографія",
    description: "Киев, Музична Украина, 88с., М П46",
    available: true
  },
  {
    id: "19",
    title: "Воспитания ума и сердца",
    author: "Дм.Кабалевский",
    year: 1984,
    genre: "Педагогіка",
    description: "Москва, Просвещение, 206с., М К12",
    available: false
  },
  {
    id: "20",
    title: "М.И. Глинка. Новые материалы и документы",
    author: "Е. Канн-Новикова",
    year: 1955,
    genre: "Документи",
    description: "Москва, Гос. муз. изд-во, 218с., М К19",
    available: true
  }
];

export const filterBooks = (query: string): Book[] => {
  if (!query) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) || 
    book.author.toLowerCase().includes(lowercaseQuery) || 
    book.genre.toLowerCase().includes(lowercaseQuery) || 
    book.description.toLowerCase().includes(lowercaseQuery)
  );
};
