import { useEffect } from "react";

export function Seo(props: { title: string; description: string }) {
  useEffect(() => {
    document.title = props.title;
    const existing = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (existing) existing.content = props.description;
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = props.description;
      document.head.appendChild(meta);
    }
  }, [props.title, props.description]);

  return null;
}
