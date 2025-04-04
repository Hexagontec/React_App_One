using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using React_App_One.Server.Data;
using React_App_One.Server.Models;
using System.Threading.Tasks;

namespace React_App_One.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly TaskContext _context;
        private readonly ILogger<TaskController> _logger;

        public TaskController(TaskContext context, ILogger<TaskController> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            try
            {
                var tasks = await _context.Tasks.ToListAsync();
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks");
                return StatusCode(500, "Internal server error while retrieving tasks");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] TaskDto taskDto)
        {
            try
            {
                // Validate input
                if (taskDto == null)
                {
                    _logger.LogWarning("AddTask called with null DTO");
                    return BadRequest("Task data is required");
                }

                if (string.IsNullOrWhiteSpace(taskDto.Title))
                {
                    return BadRequest("Title is required");
                }

                var newTask = new TaskItem
                {
                    Title = taskDto.Title.Trim(),
                    Description = taskDto.Description?.Trim() ?? string.Empty
                };

                await _context.Tasks.AddAsync(newTask);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTask), new { id = newTask.Id }, newTask);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while adding task");
                return StatusCode(500, "Error saving task to database");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error adding task");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);

                if (task == null)
                {
                    _logger.LogWarning("Task with ID {TaskId} not found", id);
                    return NotFound();
                }

                return Ok(task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving task with ID {TaskId}", id);
                return StatusCode(500, $"Internal server error while retrieving task {id}");
            }
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> TaskCompletion(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return NotFound($"Task with ID {id} not found");
                }

                task.Is_Task_Completed = !task.Is_Task_Completed;

                await _context.SaveChangesAsync();
                return Ok(task);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error toggling task {TaskId}", id);
                return Conflict("Task was modified by another user. Please refresh and try again.");
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error toggling task {TaskId}", id);
                return StatusCode(500, "Error saving task changes");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error toggling task {TaskId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return NotFound();
                }

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error deleting task {TaskId}", id);
                return StatusCode(500, "Error deleting task from database");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting task {TaskId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
