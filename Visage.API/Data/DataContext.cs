using Microsoft.EntityFrameworkCore;
using Visage.API.Models;

namespace Visage.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }

    }
}