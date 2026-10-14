import FileItem from './FileItem';

export default function FileList({ items, onRemove }) {
  return (
    <ul className="file-list">
      {items.map((item) => (
        <FileItem key={item.id} item={item} onRemove={onRemove} />
      ))}
    </ul>
  );
}
