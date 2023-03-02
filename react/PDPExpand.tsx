import React, { useEffect, useState, ReactChildren, useRef } from "react";
import { canUseDOM } from "vtex.render-runtime";
// import { createPortal } from "react-dom";

import styles from "./styles.css";

interface PDPExpandProps {

}

const PDPExpand: StorefrontFunctionComponent<PDPExpandProps> = ({ }) => {


  return <>Expand</>
}

PDPExpand.schema = {
  title: "PDP Expand",
  type: "object",
  properties: {

  }
}

export default PDPExpand;