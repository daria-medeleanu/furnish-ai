
namespace Application.DTOs
{
    public class PaginatedResultDto<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
