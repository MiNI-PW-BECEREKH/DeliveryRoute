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

namespace Deliveries.Controllers
{
    [Route("api/delivery")]
    [ApiController]
    public class DeliveryController : ControllerBase
    {

        //private static object locker = new object();
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
            return Ok(DeliveryData.deliveries);

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
                                    [FromForm] DateTime pickuptime)
        {



            Delivery d = new Delivery
            {
                ID = GeneratedID++,
                sender = new Person { name = senderfname, surname = sendersname, email = senderemail, phonenumber = senderphone, address = new Address { Street = senderstreet, Building = senderbuilding, Local = senderlocal, City = sendercity, State = senderstate, Country = sendercountry, ZipCode = senderzip } },

                receiver = new Person
                {
                    name = receiverfname,
                    surname = receiversname,
                    email = receiveremail,
                    phonenumber = receiverphone,
                    address = new Address { Street = receiverstreet, Building = receiverbuilding, Local = receiverlocal, City = receivercity, State = receiverstate, Country = receivercountry, ZipCode = receiverzip }
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

            lock (DeliveryData.deliveries)
            {
                DeliveryData.deliveries.Add(d);
            }



            return NoContent();

        }
    }
}