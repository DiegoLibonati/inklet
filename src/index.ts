import "@/index.css";
import InkletPage from "@/pages/InkletPage/InkletPage";

const onInit = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) throw new Error(`You must render a container to mount the app.`);

  const inkletPage = InkletPage();
  app.appendChild(inkletPage);
};

document.addEventListener("DOMContentLoaded", onInit);
