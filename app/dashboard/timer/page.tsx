

export default async function TimerPage() {
    const response = await fetch("/api/projects");
    const projects = await response.json();
  
    return (
      <div>
        <h2>今月の稼働時間</h2>
        {projects.map((project: any) => (
          <div key={project.id}>
            <h3>{project.name}</h3>
            <p>稼働時間: {project.totalHours || 0} 時間</p>
          </div>
        ))}
      </div>
    );
  }
  