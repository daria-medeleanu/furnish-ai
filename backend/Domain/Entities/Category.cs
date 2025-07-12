namespace Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; } 
        public required string Title { get; set; }
    }
}
