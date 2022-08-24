import Input from "../../UI/Input";
import classes from "./MealItemForm.module.css";

const MealItemForm = (props) => {
  return (
    <form className={classes.form}>
      <Input
        input={{
          id: "amount_" + props.id,
          type: "number",
          min: '1',
          max: '5',
          step: '1',
          defaultValue: '1'
        }}
        label="Amount"
      />
      <button type="submit" id="addToCart">
        + Add
      </button>
    </form>
  );
};

export default MealItemForm;
