"use client";

import React from "react";

import styles from "./GithubLink.module.css";
import { GitHubIcon } from "@/assets/icons/GithubIcon";

export const GitHubLink = () => {
  return (
    <a
      href="https://github.com/matt765/atom-animation"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.githubLink}
      aria-label="View source on GitHub"
      title="View source on GitHub"
    >
      <GitHubIcon size={25} />
    </a>
  );
};
