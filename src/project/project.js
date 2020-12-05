const { resolve } = require("bluebird");

module.exports = {
    priorityProject: (projectRepo, taskRepo, projectId) => {
        let completed
        let incompleted
        let percentual;
        let tempoRestante;
        let remainingTime = (projectRepo,taskRepo,projectId) => {
            return projectRepo.getRemainingTime(projectId)
            .then((data) => {
                let total=0
                data.forEach(row => {
                    total += row.duration>240 ? row.duration*2 : row.duration
                });
                return total
            })
        }

        return projectRepo.getCompletedTasks(projectId)
            .then((data) => {
                completed=data.length
            })
            .then(()=> {
                return projectRepo.getIncompletedTasks(projectId)
            })
            .then((data) => {
                incompleted=data.length
                percentual = parseFloat((completed*100/(completed+incompleted)).toFixed(1))

                return remainingTime(projectRepo,taskRepo,projectId).then((data) =>{
                    tempoRestante = data;
                    
                    return parseFloat(((percentual*2 + tempoRestante*4)/6).toFixed(1))
                })
            })
    },
    taskPriority: (projectRepo, projectId) => {
        return projectRepo.getIncompletedTasks(projectId)
            .then((data) => {
                if(data.length){
                    let taskPriority = {};
                    taskPriority.duration = 0;
                    data.forEach(task => {
                        if(task.duration > taskPriority.duration){
                            taskPriority = task;
                        }
                    })
                    return taskPriority.name;
                }
                return 'Não possui prioridade'
            })
    },
    disableProject: (projectRepo, projectId) => {
        return projectRepo.getIncompletedTasks(projectId)
            .then((data) => {
                if(data.length)
                    return 'Não é possível desabilitar'

                let project = {
                    id: projectId,
                    disabled: 1
                }
                return projectRepo.update(project).then(() => {
                    return 'Projeto desabilitado'
                })
            })
    }
}