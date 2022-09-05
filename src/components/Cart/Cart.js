import { useContext, useState, Fragment } from "react";

import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import Checkout from "./Checkout";
import React from "react";

const Cart = (props) => {
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };
  const addItemToCartHandler = (item) => {
    cartCtx.additem(item);
  };

  const submitOrderHandler = async (userData) => {
    setisSubmitting(true);
    await fetch("https://react-http-a8b4e-default-rtdb.firebaseio.com/orders.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userData,
        orderedItems: cartCtx.items
      }),
    });
    setisSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = [
    cartCtx.items.map((item) => (
      <CartItem
        key={item.id}
        name={item.name}
        amount={item.amount}
        price={item.price}
        onAdd={addItemToCartHandler.bind(null, item.id)}
        onRemove={cartItemRemoveHandler.bind(null, item.id)}
      />
    )),
  ];

  const orderClickHandler = () => {
    setHasConfirmed(true);
  };

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onCloseCart}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderClickHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <Fragment>
      <ul className={classes["cart-items"]}>{cartItems}</ul>
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {hasConfirmed && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onCloseCart} />
      )}
      {!hasConfirmed && modalActions}
    </Fragment>
  )

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = <p>Successfully sent the order!</p>;

  return (
    <Modal onClose={props.onCloseCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
