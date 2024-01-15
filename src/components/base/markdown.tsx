import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

function YouTubeVideo(props: { id: any }) {
  const { id } = props;
  const ref = useRef<HTMLDivElement>(null);
  const src = `https://www.youtube.com/embed/${id}`;
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current?.offsetWidth || 0);
  }, []);

  return (
    <div className="youtube-video" ref={ref}>
      <iframe
        src={src}
        width={"100%"}
        height={(width / 15) * 9}
        allow="autoplay; encrypted-media"
      ></iframe>
    </div>
  );
}

const Markdown = ({
  maxWidth,
  input,
}: {
  maxWidth?: number;
  input: string;
}) => {
  return (
    <ReactMarkdown
      // eslint-disable-next-line react/no-children-prop
      children={input}
      components={{
        img: ({
          alt,
          src,
          title,
        }: {
          alt?: string;
          src?: string;
          title?: string;
        }) => {
          if (alt === "youtube") {
            const id = (src || "").split("v=")[1];
            return <YouTubeVideo id={id} />;
          }
          return (
            <Image
              alt={alt || ""}
              src={src || ""}
              title={title}
              style={{
                maxWidth: maxWidth || 320,
                display: "block",
                margin: "auto",
              }}
            />
          );
        },
      }}
    />
  );
};

export default Markdown;
