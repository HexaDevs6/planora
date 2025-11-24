import React, { useEffect, useMemo, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const logoImage = "/favPlanora.svg";

const StyledQR = ({ value, size = 260 }) => {
  const ref = useRef(null);

   const qrCode = useMemo(() => new QRCodeStyling({
    width: size,
    height: size,
    data: value,
    type: "svg",
    margin: 10,
    dotsOptions: {
      type: "rounded",
      color: "#330C2F",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#330C2F",
    },
    cornersDotOptions: {
      color: "#330C2F",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    image: logoImage,
    imageOptions: {
      crossOrigin: "anonymous",
      imageSize: 0.25,
      backgroundColor: "#ffffff",
    },
  }), [size, value]);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, []);

  return <div ref={ref}></div>;
};

export default StyledQR;
