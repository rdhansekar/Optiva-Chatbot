using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Models
{
    public class GridModel
    {
        public int start { get; set; }
        public int limit { get; set; }
        public string sortCol { get; set; }
        public int sortOrder { get; set; }
        public string searchVal { get; set; }

        public int type = 0;
    }
}
