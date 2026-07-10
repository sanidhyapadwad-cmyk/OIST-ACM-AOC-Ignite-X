function AgentCard({ title, children }) {
  return (
    <div className="agent-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default AgentCard;