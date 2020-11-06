using System;

namespace Deliveries.Models
{
    [Serializable]
    public class Address
    {
        public string Street;
        public string Building;
        public string Local;
        public string City;
        public string State;
        public string Country;
        public string ZipCode;
    }

    [Serializable]
    public class Person
    {
        public string name;
        public string surname;
        public string email;
        public string phonenumber;

        public Address address;
    }
    [Serializable]
    public class Package
    {
        public string parceltype;
        public int width;
        public int height;
        public int length;
        public int weight;

        public DateTime Date;
        public DateTime Time;
        public string comments;

    }

    [Serializable]
    public class Delivery
    {
        public int ID;
        public Person sender;
        public Person receiver;
        public Package package;
    }



}
