import React, { useEffect, useState, ReactChildren, useRef } from "react";
import { canUseDOM } from "vtex.render-runtime";
// import { createPortal } from "react-dom";

import styles from "./styles.css";

interface PDPExpandProps {
  children: ReactChildren | any
  childTitles: Array<string>
}

const descriptionClass = "vtex-ebs-product-features-div";
const specsClass = "vtex-ebs-product-specs-div";
const plus = "+";
const minus = "-";

const PDPExpand: StorefrontFunctionComponent<PDPExpandProps> = ({ children, childTitles }) => {
  const openGate = useRef(true);
  const descriptionButton: any = useRef();
  const descriptionWindow: any = useRef();
  const descriptionInfo: any = useRef();
  const [loading, setLoading] = useState(true);
  const [descriptionHTML, setDescriptionHTML] = useState<any>();
  const [techSpecsHTML, setTechSpecsHTML] = useState<any>();
  const pathOnRun = useRef("");

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;
    run();
  });

  useEffect(() => {
    if (canUseDOM) {
      window.addEventListener("message", handleMessage);
      return () => {
        window.removeEventListener("message", handleMessage);
      }
    } else return;
  });

  const handleMessage = (e: any) => {
    const eventName = e.data.eventName;
    // eventName ? console.info({ eventName }) : null;

    if (eventName === "vtex:pageView" && !loading) run();
  }

  const run = () => {
    setLoading(true);
    if (!canUseDOM) return;
    pathOnRun.current = window.location.search;

    const descriptionDOM: any = document.querySelector(`.${descriptionClass}`);
    const specsDOM: any = document.querySelector(`.${specsClass}`);

    setDescriptionHTML(descriptionDOM?.innerHTML);
    setTechSpecsHTML(specsDOM?.innerHTML);

    setLoading(false);

    setTimeout(() => {
      // Timeout for aesthetics only - LM
      openWindow(descriptionButton.current, descriptionWindow.current, descriptionInfo.current);
    }, 500);
  };

  const handleClick = (e: any) => {
    if (!canUseDOM) return;

    const clicked = e.currentTarget.dataset.button;
    const buttonElement: any = document.querySelector(`[data-button="${clicked}"]`);
    const windowElement: any = document.querySelector(`[data-window="${clicked}"]`);
    const infoElement: any = document.querySelector(`[data-info="${clicked}"]`);
    const expanded = windowElement.getAttribute("aria-expanded") === "true";

    expanded ?
      closeWindow(buttonElement, windowElement, infoElement) :
      openWindow(buttonElement, windowElement, infoElement);
  };

  const openWindow = (buttonElement: any, windowElement: any, infoElement: any) => {
    closeAllWindows();

    windowElement.setAttribute("aria-expanded", "true");
    const infoHeight = infoElement.offsetHeight;
    windowElement.style.height = `${infoHeight}px`;
    infoElement.setAttribute("aria-hidden", "false");
    buttonElement.innerText = minus;
  }

  const closeWindow = (buttonElement: any, windowElement: any, infoElement: any) => {
    windowElement.setAttribute("aria-expanded", "false");
    windowElement.style.height = `0px`;
    infoElement.setAttribute("aria-hidden", "true");
    buttonElement.innerText = plus;
  };

  const closeAllWindows = () => {
    const allWindows: any = document.querySelectorAll("[data-window]");
    const allButtons: any = document.querySelectorAll("[data-button]");
    const allInfos: any = document.querySelectorAll("[data-info]");

    allWindows.forEach((dataWindow: any, index: number) => {
      allButtons[index].innerText = plus;
      allInfos[index].setAttribute("aria-hidden", "true");
      dataWindow.setAttribute("aria-expanded", "false");
      dataWindow.style.height = `0px`;
    });
  };

  const ChildSection = (props: any) => (<>
    <div className={styles.titleAndButton}>
      <h2 className={styles.title}>{childTitles[props.index]}</h2>
      <button data-button={props.index} onClick={handleClick} className={styles.button}>{plus}</button>
    </div>
    <div data-window={props.index} tabIndex={-1} aria-expanded="false" style={{ height: "0px" }} className={styles.window}>
      <div data-info={props.index} tabIndex={-1} aria-hidden="true" className={styles.info}>
        {props.child}
      </div>
    </div>
  </>);

  const DescriptionSection = () => (
    <div className={styles.wrapper}>
      <div className={styles.titleAndButton}>
        <h2 className={styles.title}>{childTitles[0]}</h2>
        <button ref={descriptionButton} data-button={0} onClick={handleClick} className={styles.button}>{plus}</button>
      </div>
      <div ref={descriptionWindow} data-window={0} tabIndex={-1} aria-expanded="false" style={{ height: "0px" }} className={styles.window}>
        <div ref={descriptionInfo} data-info={0} tabIndex={-1} aria-hidden="true" className={styles.info} dangerouslySetInnerHTML={{ __html: descriptionHTML }}></div>
      </div>
    </div>
  );

  const TechSpecsSection = () => (
    <div className={styles.wrapper}>
      <div className={styles.titleAndButton}>
        <h2 className={styles.title}>{childTitles[1]}</h2>
        <button data-button="1" onClick={handleClick} className={styles.button}>{plus}</button>
      </div>
      <div data-window={1} tabIndex={-1} aria-expanded="false" style={{ height: "0px" }} className={styles.window}>
        <div data-info={1} tabIndex={-1} aria-hidden="true" dangerouslySetInnerHTML={{ __html: techSpecsHTML }} className={styles.info}>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (<h2>Loading...</h2>);
  } else {
    return (
      <div className={styles.container}>
        {descriptionHTML && <DescriptionSection />}
        {techSpecsHTML && <TechSpecsSection />}
        {children.map((child: any, index: number) => (
          <div key={`child-${index + 2}`} className={styles.wrapper}>
            <ChildSection child={child} index={index + 2} />
          </div>
        ))}
      </div>
    )
  }
}

PDPExpand.schema = {
  title: "PDP Expand",
  type: "object",
  properties: {

  }
}

export default PDPExpand;
