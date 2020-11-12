using System;

namespace Deliveries.Models
{
    [Serializable]
    public class Address
    {
        
        public string Street{get;set;}
        public string Building{get;set;}
        public string Local{get;set;}
        public string City{get;set;}
        public string State{get;set;}
        public string Country{get;set;}
        public string ZipCode{get;set;}

        public string Coordinate {get; set;}
    }

    [Serializable]
    public class Person
    {
        public string name{get;set;}
        public string surname{get;set;}
        public string email{get;set;}
        public string phonenumber{get;set;}

        public Address address{get;set;}
    }
    [Serializable]
    public class Package
    {
        public string parceltype{get;set;}
        public int width{get;set;}
        public int height{get;set;}
        public int length{get;set;}
        public int weight{get;set;}

        public DateTime Date{get;set;}
        public DateTime Time{get;set;}
        public string comments{get;set;}

    }

    [Serializable]
    public class Delivery
    {
        public int ID{get;set;}
        public Person sender{get;set;}
        public Person receiver{get;set;}
        public Package package{get;set;}
    }



}
