using System.ComponentModel.DataAnnotations;

namespace React_App_One.Server.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        public DateTime Insert_Datetime { get; set; } = DateTime.Now;
        public bool Is_Task_Completed { get; set; } = false;
    }
}
