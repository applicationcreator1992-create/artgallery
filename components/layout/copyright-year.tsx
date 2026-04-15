"use client";

import { useEffect, useState } from "react";

export default function CopyrightYear() {
  const [currentYear, setCurrentYear] = useState(2023);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");

  return <>&copy; {copyrightDate} Art by Lilya. All rights reserved.</>;
}
