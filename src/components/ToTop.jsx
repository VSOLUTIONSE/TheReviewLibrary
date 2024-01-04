import React, { useState } from "react";
import styled from "styled-components";
import { FaAngleUp } from "react-icons/fa";
import { useWindowScroll } from "react-use";
import { useEffect } from "react";

const BackToTop = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  text-align: center;
  border-radius: 100%;
  background-color: rgba(143, 130, 130, 0.62);
  display: flex;
  z-index: 20;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.49), -1px -1px 3px rgba(0, 0, 0, 0.49);

  &:active {
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.49),
      inset -1px -1px 3px rgba(0, 0, 0, 0.39);
    width: 53px;
    height: 53px;
  }
`;

const ScrollToTop = () => {
  const { y: pageYOffset } = useWindowScroll();
  const [visibile, setVisible] = useState(false);

  useEffect(() => {
    if (pageYOffset > 400) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pageYOffset]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visibile) {
    return;
  }

  return (
    <>
      <BackToTop onClick={scrollToTop}>
        <FaAngleUp size={30} />
      </BackToTop>
    </>
  );
};

export default ScrollToTop;
