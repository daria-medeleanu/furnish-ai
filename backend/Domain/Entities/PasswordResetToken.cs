namespace Domain.Entities
{
    public class PasswordResetToken
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public bool IsUsed { get; set; }
    }
}
