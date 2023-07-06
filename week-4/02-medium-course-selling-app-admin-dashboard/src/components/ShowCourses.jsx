import "./cardGallery.css";

function CardGallery() {
  const cards = [
    {
      id: 1,
      image:
        "https://www.classcentral.com/report/wp-content/uploads/2022/04/BCG-Web-Development-NEW-Banner.png",
      title: "Card 1",
      description: "Description 1",
      price: "$10",
    },
    {
      id: 2,
      image:
        "https://www.classcentral.com/report/wp-content/uploads/2022/04/BCG-Web-Development-NEW-Banner.png",
      title: "Card 2",
      description: "Description 2",
      price: "$20",
    },
    {
      id: 3,
      image:
        "https://www.classcentral.com/report/wp-content/uploads/2022/04/BCG-Web-Development-NEW-Banner.png",
      title: "Card 3",
      description: "Description 3",
      price: "$30",
    },
  ];

  const handleShowMore = (id) => {
    // Handle logic to show more details for the card with the given id
    console.log(`Show more for card with id ${id}`);
  };

  return (
    <div className="card-gallery">
      {cards.map((card) => (
        <div className="card" key={card.id}>
          <img src={card.image} alt={card.title} />
          <h2>{card.title}</h2>
          <p>{card.description}</p>
          <span className="price">{card.price}</span>
          <button onClick={() => handleShowMore(card.id)}>Show More</button>
        </div>
      ))}
    </div>
  );
}

export default CardGallery;
