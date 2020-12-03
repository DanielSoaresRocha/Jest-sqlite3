module.exports = {
    createTask: (projectRepo, taskRepo, name, description, duration, isComplete, projectId) => {
        let total = 0;
        return projectRepo.getRemainingTime(projectId)
                        .then((data) => {
                            data.forEach((row) => {
                                total += row.duration
                            });
                            if(total < 800){
                                // Adicionar a task ao BD
                                taskRepo.create( name, description, duration, isComplete, projectId)
                                    .then( () => {
                                        return "Confirmed"
                                    })
                            }
                            return "Refused"; 
                        })
                }
}