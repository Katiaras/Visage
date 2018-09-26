using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace Visage.API.Controllers
{
    public class FallbackController : Controller
    {
        public IActionResult Index() {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), 
                "wwwroot", "indext.html"), "text/HTML");
        }
    }
}