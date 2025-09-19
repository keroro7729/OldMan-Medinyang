import React from "react";
import SettingItem from "./SettingItem";

const SettingSection = ({ number, title, items }) => {
  return (
    <div style={styles.section}>
      <div style={styles.header}>
        {number && <span style={styles.number}>{number}</span>}
        <span style={styles.title}>{title}</span>
      </div>
      {items.map((item, index) => {
        const isObject = typeof item === "object";
        return (
          <SettingItem
            key={index}
            label={isObject ? item.label : item}
            onClick={isObject ? item.onClick : undefined}
          />
        );
      })}
    </div>
  );
};

const styles = {
  section: {
    backgroundColor: "#D6F1FF",
    borderRadius: "12px",
    padding: "12px 16px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  title: {
    fontSize: "16px",
    color: "#111827",
  },
};

export default SettingSection;
