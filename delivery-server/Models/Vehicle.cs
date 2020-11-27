using System;
using System.Collections.Generic;
using Deliveries.Data;

namespace Deliveries.Models
{
    public class Vehicle
    {
        public int Capacity { get; set; }
        public int ID { get; set; }

        public Depot VehicleDepot { get; set; }
        public List<string> Route = new List<string>();

        public List<string> RouteProp
        {
            get
            {
                return Route;
            }
        }

        public List<string> DeliveryRoute = new List<string>();

        public List<string> DeliveryRouteProp
        {
            get
            {
                return DeliveryRoute;
            }
        }

        private Delivery findClosestPickUp(string currentLoc)
        {
            double minDist = 1;
            Delivery minDistDel = DeliveryData.deliveries[0];
            double[] currentlatlng = new double[2];
            double.TryParse(currentLoc.Split(",")[0], out currentlatlng[0]);
            double.TryParse(currentLoc.Split(",")[1], out currentlatlng[1]);
            foreach (var item in DeliveryData.deliveries)
            {
                if (!item.PickedUp)
                {

                    double[] loc = new double[2];
                    double.TryParse(item.sender.address.Coordinate.Split(",")[0], out loc[0]);
                    double.TryParse(item.sender.address.Coordinate.Split(",")[1], out loc[1]);
                    double dist = Math.Sqrt(Math.Pow(loc[0] - currentlatlng[0], 2) + Math.Pow(loc[1] - currentlatlng[1], 2));
                    if (dist < minDist)
                    {
                        minDist = dist;
                        minDistDel = item;
                    }
                }

            }


            return minDistDel;

        }

        public static Object locker = new object();
        public void PickUpPackages()
        {

            Route.Clear();
            lock (locker)
            {
                Route.Add(VehicleDepot.Coordinate);
                string currentLoc = VehicleDepot.Coordinate;
                int CapacityLeft = Capacity;
                for (int i = 0; i < DeliveryData.deliveries.Count; i++)
                {//calculate closest here
                    Delivery closestItem = findClosestPickUp(currentLoc);
                    if (closestItem == null)
                    {
                        return;
                    }
                    if (CapacityLeft - closestItem.package.weight < 0)
                    {
                        System.Console.WriteLine("run out of capacity");
                        break;
                    }
                    if (!closestItem.PickedUp)
                    {

                        CapacityLeft -= closestItem.package.weight;
                        closestItem.PickedUp = true;
                        Route.Add(closestItem.sender.address.Coordinate);
                        currentLoc = closestItem.sender.address.Coordinate;
                    }

                }
                Route.Add(VehicleDepot.Coordinate);

            }
        }


        private Delivery findClosestDelivery(string currentLoc)
        {
            double minDist = 1;
            Delivery minDistDel = new Delivery();
            double[] currentlatlng = new double[2];
            double.TryParse(currentLoc.Split(",")[0], out currentlatlng[0]);
            double.TryParse(currentLoc.Split(",")[1], out currentlatlng[1]);
            foreach (var item in Route)
            {
                
                foreach (var current in DeliveryData.deliveries)
                {
                    if (current.sender.address.Coordinate == item)
                    {
                        if (!current.Delivered)
                        {

                            double[] loc = new double[2];
                            double.TryParse(current.receiver.address.Coordinate.Split(",")[0], out loc[0]);
                            double.TryParse(current.receiver.address.Coordinate.Split(",")[1], out loc[1]);
                            double dist = Math.Sqrt(Math.Pow(loc[0] - currentlatlng[0], 2) + Math.Pow(loc[1] - currentlatlng[1], 2));
                            if (dist < minDist)
                            {
                                minDist = dist;
                                minDistDel = current;
                            }
                        }
                    }
                }


            }

            return minDistDel;
        }

        public void DeliverPackages()
        {
            DeliveryRoute.Clear();
            DeliveryRoute.Add(VehicleDepot.Coordinate);
            string currentLoc = VehicleDepot.Coordinate;
            for (int i = 0; i < Route.Count; i++)
            {//calculate closest here
                Delivery closestItem = findClosestDelivery(Route[i]);
                if (Route.Count <= 0)
                {
                    System.Console.WriteLine("run out packages to deliver");
                    break;
                }
                if (!closestItem.Delivered && closestItem.PickedUp && this.Route.Contains(closestItem.sender.address.Coordinate))
                {


                    closestItem.Delivered = true;
                    Route.Remove(closestItem.sender.address.Coordinate);
                    DeliveryRoute.Add(closestItem.receiver.address.Coordinate);
                    currentLoc = closestItem.receiver.address.Coordinate;
                }

            }
            DeliveryRoute.Add(VehicleDepot.Coordinate);
        }
    }

}

