export function Thumbnail({ imageUrl }: { imageUrl: string | null }) {
  if (!imageUrl) {
    return <div>No image found</div>;
  }
  return (
    <div>
      <img src={imageUrl} alt="thumbnail" />
    </div>
  );
}
