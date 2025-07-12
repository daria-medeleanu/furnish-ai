using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {

        private const string UuidGenerationFunction = "uuid_generate_v4()";
        public DbSet<User> Users { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Offer> Offers { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("uuid-ossp");

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Email).IsRequired();
                entity.Property(u => u.Name).IsRequired();
                entity.Property(u => u.Surname).IsRequired();
                entity.Property(u => u.City).IsRequired();
                entity.Property(u => u.Country).IsRequired();
                entity.Property(u => u.Phone).IsRequired();
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.ImageUrl);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql(UuidGenerationFunction)
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.Title).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(2000);
                entity.Property(e => e.Price).IsRequired();
                entity.Property(e => e.Condition).IsRequired();
                entity.Property(e => e.Currency).IsRequired();
                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasColumnType("uuid");

                entity.Property(e => e.ImageUrls)
                    .HasColumnType("jsonb");

                entity.HasOne(e => e.Category)
                    .WithMany()
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.SetNull);
                entity.Property(e => e.IsActive)
                  .IsRequired()
                  .HasDefaultValue(true);

            });

            modelBuilder.Entity<Category>(entity =>
            {

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql(UuidGenerationFunction)
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.Title).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql(UuidGenerationFunction)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasColumnType("uuid");

                entity.Property(e => e.SellerId)
                    .IsRequired()
                    .HasColumnType("uuid");

                entity.Property(e => e.ProductId)
                    .IsRequired()
                    .HasColumnType("uuid");

                entity.Property(e => e.OrderDate)
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.OrderStatus)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Price)
                    .IsRequired()
                    .HasColumnType("decimal(18,2)");

                entity.Property(e => e.Currency)
                    .IsRequired();

                entity.HasOne(e => e.Client)
                    .WithMany() 
                    .HasForeignKey(e => e.ClientId)
                    .OnDelete(DeleteBehavior.Restrict);

                
                entity.HasOne(e => e.Seller)
                    .WithMany() 
                    .HasForeignKey(e => e.SellerId)
                    .OnDelete(DeleteBehavior.Restrict);


                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasMaxLength(500);
            });


            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Product)
                    .WithMany()
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Offer>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.Id).HasDefaultValueSql(UuidGenerationFunction);
                entity.Property(o => o.BuyerId).IsRequired();
                entity.Property(o => o.BuyerName).HasMaxLength(100);
                entity.Property(o => o.ProductId).IsRequired();
                
                entity.Property(o => o.OfferedPrice)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(o => o.Status)
                      .IsRequired()
                      .HasConversion<int>();
                entity.Property(o => o.CreatedAt)
                    .IsRequired();
                entity.Property(o => o.SellerResponse)
                    .HasMaxLength(500);
                entity.Property(o => o.Message)
                    .HasMaxLength(500);
                entity.HasOne(o => o.Product)
                    .WithMany()
                    .HasForeignKey(o => o.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);

            });
            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql(UuidGenerationFunction)
                    .ValueGeneratedOnAdd();

                entity.Property(t => t.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(t => t.Token)
                    .IsRequired();

                entity.Property(t => t.Expiration)
                    .IsRequired();

                entity.Property(t => t.IsUsed)
                    .IsRequired()
                    .HasDefaultValue(false);
            });
        }

}
}
