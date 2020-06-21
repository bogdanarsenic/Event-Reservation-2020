﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TicketReservation.Models;
using TicketReservation.ModelsDB;

namespace TicketReservation.Controllers
{
    [RoutePrefix("api/Ticket")]
    public class TicketController : ApiController
    {
        UserDB userDB = new UserDB();
        CommentDB commentDB = new CommentDB();
        LocationDB locationDB = new LocationDB();
        ManifestationDB manifestationDB = new ManifestationDB();
        TicketDB ticketDB = new TicketDB();



        [Route("GetAllTickets")]
        public List<Ticket> GetAllTickets()
        {
            List<Ticket> ret = null;
            ret = ticketDB.GetAll();
            return ret;
        }

        [Route("GetAllTicketsManifestation")]
        public List<Ticket> GetAllTicketsManifestation(string IdMan)
        {
            List<Ticket> ret = null;
            ret = ticketDB.GetAllByManifestationId(IdMan);
            return ret;
        }

        [Route("RegisterTicket")]
        public string RegisterTicket(Ticket ticket)
        {
            ticket.Id = Guid.NewGuid();
            ticketDB.Insert(ticket);
            return "Success";
        }

        [Route("GetAllTicketsUser")]
        public List<Ticket> GetAllTicketsUser(string IdSeller)
        {
            List<Ticket> ret1 = null;
            List<Ticket> ret2 = new List<Ticket>();
            User U = userDB.GetOne(IdSeller);
            ret1 = ticketDB.GetAll();
            foreach (Ticket t in ret1)
            {
                t.Manifestation = manifestationDB.GetOneById(t.ManifestationId);

                if (t.Manifestation.UserId == U.Name + " " + U.Surname)
                {
                    ret2.Add(t);
                }
            }
            return ret2;
        }

    }
}
