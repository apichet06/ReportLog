import React from "react";

const PopupLink = ({ href, children, width = 500, height = 300 }) => {
  const handlePopupOpen = (event) => {
    // ป้องกันไม่ให้ browser redirect ตามปกติของลิงก์
    event.preventDefault();

    // คำนวณตำแหน่งเพื่อเปิด popup ตรงกลางหน้าจอ
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      href,
      "updateWindow", // ตั้งชื่อ window เพื่อให้เปิดทับหน้าต่างเดิมถ้ามีการคลิกซ้ำ
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    // ทำให้ popup ที่เปิดขึ้นมาอยู่ข้างหน้าสุด
    if (window.focus && popup) {
      popup.focus();
    }

    // ปิดหน้าต่างปัจจุบันหลังจากที่ popup เปิดขึ้นมาแล้ว
    window.close();
  };

  return (
    <a href={href} onClick={handlePopupOpen}>
      {children}
    </a>
  );
};

export default PopupLink;
