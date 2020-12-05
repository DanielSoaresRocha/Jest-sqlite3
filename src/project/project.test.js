const project = require('./project')
const Promise = require('bluebird')

const AppDAO = require('../../src/db/dao')
const ProjectRepository = require('../../src/project/project_repository')
const TaskRepository = require('../../src/task/task_repository')
const { resolve } = require('bluebird')

let dao
let projectRepo
let taskRepo

describe('Análise dos projetos', () => {
    
    beforeAll(() => {
        return new Promise((resolve, reject) => {
            dao = new AppDAO('../../database.db');
            resolve()
        }).then(() => {
            projectRepo = new ProjectRepository(dao);
            taskRepo = new TaskRepository(dao);
            resolve()
        }).then(() => {
            resolve()
        })
    })

    it ('Deve retornar task 9 para o projeto de id 2', () => {
        const projectId = 2;
        return (project.taskPriority(projectRepo, projectId)).then((data) => expect(data).toBe('Task 9'))
    })

    it ('Deve retornar Não possui prioridade para o projeto de id 1', () => {
        const projectId = 3;
        return (project.taskPriority(projectRepo, projectId)).then((data) => expect(data).toBe('Não possui prioridade'))
    })

    it ('Não é possível desabilitar o projeto de id 1, que tem tarefas incompletas', () => {
        const projectId = 1;
        return (project.disableProject(projectRepo, projectId)).then((data) => expect(data).toBe('Não é possível desabilitar'))
    })

    it ('É possível desabilitar o projeto de id 3, que possui todas as tarefas completas', () => {
        const projectId = 3;
        return (project.disableProject(projectRepo, projectId)).then((data) => expect(data).toBe('Projeto desabilitado'))
    })

    it ('Verificar a prioridade de um projeto', () => {
        const projectId = 2;
        return (project.priorityProject(projectRepo, taskRepo, projectId)).then((data) => expect(data).toBe(804.8))
    })
})