
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
    title: "Кобзар",
    author: "Тарас Шевченко",
    year: 1840,
    genre: "Поезія",
    description: "Збірка поетичних творів Тараса Шевченка, що стала символом української літератури.",
    available: true,
    image: "https://images.unsplash.com/photo-1531166177585-73729e1e71b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "2",
    title: "Лісова пісня",
    author: "Леся Українка",
    year: 1911,
    genre: "Драма",
    description: "Драма-феєрія, один із найвідоміших творів української літератури.",
    available: true,
    image: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "3",
    title: "Тигролови",
    author: "Іван Багряний",
    year: 1944,
    genre: "Пригодницький роман",
    description: "Пригодницький роман про драматичну долю українського інженера Григорія Многогрішного.",
    available: false,
    image: "https://images.unsplash.com/photo-1606787619248-f301830a5a57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "4",
    title: "Чорна рада",
    author: "Пантелеймон Куліш",
    year: 1857,
    genre: "Історичний роман",
    description: "Перший історичний роман в українській літературі, про події 1663 року в Україні.",
    available: true,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "5",
    title: "Захар Беркут",
    author: "Іван Франко",
    year: 1883,
    genre: "Історична повість",
    description: "Історична повість про боротьбу карпатських горян проти монголо-татарської навали.",
    available: true,
    image: "https://images.unsplash.com/photo-1598618253208-d75408cee680?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "6",
    title: "Місто",
    author: "Валер'ян Підмогильний",
    year: 1928,
    genre: "Роман",
    description: "Роман про життя молодої людини в місті та її внутрішні переживання.",
    available: false,
    image: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "7",
    title: "Тіні забутих предків",
    author: "Михайло Коцюбинський",
    year: 1911,
    genre: "Повість",
    description: "Повість про життя і кохання гуцулів Івана та Марічки на тлі карпатських легенд.",
    available: true,
    image: "https://images.unsplash.com/photo-1527792054656-5e04760023a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "8",
    title: "Маруся Чурай",
    author: "Ліна Костенко",
    year: 1979,
    genre: "Історичний роман",
    description: "Історичний роман у віршах про легендарну українську народну поетесу та піснярку.",
    available: true,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "9",
    title: "Ворошиловград",
    author: "Сергій Жадан",
    year: 2010,
    genre: "Роман",
    description: "Роман про повернення героя до рідного міста та зіткнення з минулим.",
    available: true,
    image: "https://images.unsplash.com/photo-1585245542456-a772bede0220?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "10",
    title: "Солодка Даруся",
    author: "Марія Матіос",
    year: 2004,
    genre: "Роман",
    description: "Психологічна драма про долю жінки в буковинському селі.",
    available: false,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
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
