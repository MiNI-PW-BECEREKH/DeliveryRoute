using System.Collections.Generic;

namespace Deliveries.Models
{
    public class Depot
    {
        public string Coordinate { get; } = "52.22192995997929,21.0074580318625";

        public List<Vehicle> vehicles = new List<Vehicle>();
    }
}