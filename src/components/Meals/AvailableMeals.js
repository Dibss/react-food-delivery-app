import { useState, useEffect } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMealsHandler = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://react-http-a8b4e-default-rtdb.firebaseio.com/meals.json"
        );
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
  
        const data = await response.json();
  
        const loadedMeals = [];
  
        for (const key in data) {
          loadedMeals.push({
            id: key,
            name: data[key].name,
            description: data[key].description,
            price: data[key].price,
          });
        }
        
        setMeals(loadedMeals);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };
    fetchMealsHandler()
  }, [])

  const mealsList = meals.map((meal) => (
    <MealItem
      id={meal.id}
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  let content;

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
        <section className={classes['meals-loading']}>{content}</section>
      </Card>
    </section>
  );
};

export default AvailableMeals;
