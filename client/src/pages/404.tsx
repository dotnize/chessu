export default function NotFound() {}

// Temporary. Move to app/ directory when it's supported

export function getStaticProps() {
  return {
    redirect: {
      destination: "/",
      permanent: true
    }
  };
}
