using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Text.Encodings.Web;
using System.Text.Json;
using Deliveries.Models;
using Deliveries.Data;
using System.Web;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;

namespace Deliveries.Controllers
{
    [Route("api/delivery")]
    [ApiController]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public class DeliveryController : ControllerBase
    {

        private static readonly object locker = new object();
        private static int GeneratedID = 0;
        [HttpGet]
        public ActionResult<List<Delivery>> GetDeliveries()
        {

            //  try
            //  {
            // string json = JsonSerializer.Serialize(DeliveryData.deliveries);
            // return json;

            //  }
            //  catch (System.Exception)
            //  {
            //      return "";

            //  }

            lock (locker)
            {
                return Ok(DeliveryData.deliveries);

            }
        }



        [HttpPost]
        public IActionResult Post([FromForm] string senderfname,
                                    [FromForm] string sendersname,
                                    [FromForm] string senderemail,
                                    [FromForm] string senderphone,
                                    [FromForm] string senderstreet,
                                    [FromForm] string senderbuilding,
                                    [FromForm] string senderlocal,
                                    [FromForm] string sendercity,
                                    [FromForm] string senderzip,
                                    [FromForm] string senderstate,
                                    [FromForm] string sendercountry,
                                    [FromForm] string receiverfname,
                                    [FromForm] string receiversname,
                                    [FromForm] string receiveremail,
                                    [FromForm] string receiverphone,
                                    [FromForm] string receiverstreet,
                                    [FromForm] string receiverbuilding,
                                    [FromForm] string receiverlocal,
                                    [FromForm] string receivercity,
                                    [FromForm] string receiverzip,
                                    [FromForm] string receiverstate,
                                    [FromForm] string receivercountry,
                                    [FromForm] string parceltype,
                                    [FromForm] int width,
                                    [FromForm] int height,
                                    [FromForm] int length,
                                    [FromForm] int weight,
                                    [FromForm] string comments,
                                    [FromForm] DateTime pickupdate,
                                    [FromForm] DateTime pickuptime,
                                    [FromForm] string sendercoordinate,
                                    [FromForm] string receivercoordinate)
        {

            System.Console.WriteLine(parceltype);

            Delivery d = new Delivery
            {
                ID = GeneratedID++,
                sender = new Person { name = senderfname, surname = sendersname, email = senderemail, phonenumber = senderphone, address = new Address { Street = senderstreet, Building = senderbuilding, Local = senderlocal, City = sendercity, State = senderstate, Country = sendercountry, ZipCode = senderzip, Coordinate = sendercoordinate } },

                receiver = new Person
                {
                    name = receiverfname,
                    surname = receiversname,
                    email = receiveremail,
                    phonenumber = receiverphone,
                    address = new Address { Street = receiverstreet, Building = receiverbuilding, Local = receiverlocal, City = receivercity, State = receiverstate, Country = receivercountry, ZipCode = receiverzip, Coordinate = receivercoordinate }
                },

                package = new Package
                {
                    parceltype = parceltype,
                    width = width,
                    height = height,
                    length = length,
                    weight = weight,
                    Date = pickupdate,
                    Time = pickuptime,
                    comments = comments
                }
            };

            lock (locker)
            {
                DeliveryData.deliveries.Add(d);

            }

            return NoContent();

        }



        [HttpDelete("{id}")]
        public ActionResult Delete(int ID)
        {
            lock (locker)
            {
                foreach (var item in DeliveryData.deliveries)
                {
                    if (item.ID == ID)
                    {
                        DeliveryData.deliveries.Remove(item);
                        return Ok();
                    }
                }
                return NotFound(ID);

            }
        }


        [HttpPatch("{id}")]
        public ActionResult Patch(int ID,[FromForm] int deliveryid,
                                    [FromForm] string senderfname,
                                    [FromForm] string sendersname,
                                    [FromForm] string senderemail,
                                    [FromForm] string senderphone,
                                    [FromForm] string senderstreet,
                                    [FromForm] string senderbuilding,
                                    [FromForm] string senderlocal,
                                    [FromForm] string sendercity,
                                    [FromForm] string senderzip,
                                    [FromForm] string senderstate,
                                    [FromForm] string sendercountry,
                                    [FromForm] string receiverfname,
                                    [FromForm] string receiversname,
                                    [FromForm] string receiveremail,
                                    [FromForm] string receiverphone,
                                    [FromForm] string receiverstreet,
                                    [FromForm] string receiverbuilding,
                                    [FromForm] string receiverlocal,
                                    [FromForm] string receivercity,
                                    [FromForm] string receiverzip,
                                    [FromForm] string receiverstate,
                                    [FromForm] string receivercountry,
                                    [FromForm] string parceltype,
                                    [FromForm] int width,
                                    [FromForm] int height,
                                    [FromForm] int length,
                                    [FromForm] int weight,
                                    [FromForm] string comments,
                                    [FromForm] DateTime pickupdate,
                                    [FromForm] DateTime pickuptime,
                                    [FromForm] string sendercoordinate,
                                    [FromForm] string receivercoordinate)
        {
            
            lock (locker)
            {
                foreach (var item in DeliveryData.deliveries)
                {
                    if (item.ID == ID)
                    {
                        item.sender.name = senderfname;
                        item.sender.surname = sendersname;
                        item.sender.email = senderemail;
                        item.sender.phonenumber = senderphone;
                        item.sender.address.Street = senderstreet;
                        item.sender.address.Building = senderbuilding;
                        item.sender.address.Local = senderlocal;
                        item.sender.address.City = sendercity;
                        item.sender.address.ZipCode = senderzip;
                        item.sender.address.State = senderstate;
                        item.sender.address.Country = sendercountry;
                        item.sender.address.Coordinate = sendercoordinate;


                        item.receiver.name = receiverfname;
                        item.receiver.surname = receiversname;
                        item.receiver.email = receiveremail;
                        item.receiver.phonenumber = receiverphone;
                        item.receiver.address.Street = receiverstreet;
                        item.receiver.address.Building = receiverbuilding;
                        item.receiver.address.Local = receiverlocal;
                        item.receiver.address.City = receivercity;
                        item.receiver.address.ZipCode = receiverzip;
                        item.receiver.address.State = receiverstate;
                        item.receiver.address.Country = receivercountry;
                        item.receiver.address.Coordinate = receivercoordinate;

                        item.package.parceltype = parceltype;
                        item.package.width = width;
                        item.package.height = height;
                        item.package.length = length;
                        item.package.weight = weight;
                        item.package.Date = pickupdate;
                        item.package.Time = pickuptime;
                        item.package.comments = comments;


                        return Ok();
                    }
                }
                return NotFound(deliveryid);
            }
        }

    }
}
