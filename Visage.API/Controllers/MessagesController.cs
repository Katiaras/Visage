using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Visage.API.Data;
using Visage.API.Dtos;
using Visage.API.Helpers;
using Visage.API.Models;

namespace Visage.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/messages")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IVisageRepository repo;
        private readonly IMapper mapper;

        public MessagesController(IVisageRepository repo, IMapper mapper)
        {
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            // Check if the user calling the api is the actual user who's profile is requested to be modified
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messageFromRepo = await repo.GetMessage(id);

            if (messageFromRepo == null)
            {
                return NotFound();
            }

            return Ok(messageFromRepo);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMesssageThread(int userId, int recipientId)
        {
            // Check if the user calling the api is the actual user who's profile is requested to be modified
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messagesFromRepo = await repo.GetMessageThread(userId, recipientId);

            var messageThread = mapper.Map<IEnumerable<MessageForReturnDto>>(messagesFromRepo);

            return Ok(messageThread);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery] MessageParams messageParams)
        {
            // Check if the user calling the api is the actual user who's profile is requested to be modified
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            messageParams.UserId = userId;
            var messagesFromRepo = await repo.GetMessagesForUser(messageParams);

            var messagesForReturn = mapper.Map<IEnumerable<MessageForReturnDto>>(messagesFromRepo);

            Response.AddPagination(
                messagesFromRepo.CurrentPage, messagesFromRepo.PageSize,
                 messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);


            if (messagesFromRepo == null)
            {
                return NotFound();
            }

            return Ok(messagesForReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            // Check if the user calling the api is the actual user who's profile is requested to be modified
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            messageForCreationDto.SenderId = userId;
            var recipient = await repo.GetUser(messageForCreationDto.RecipientId);

            if (recipient == null)
            {
                return BadRequest("Could not find user");
            }
            var message = mapper.Map<Message>(messageForCreationDto);

            repo.Add(message);

            var messageToReturn = mapper.Map<MessageForCreationDto>(message);

            if (await repo.SaveAll())
            {
                return CreatedAtRoute("GetMessage", new { id = message.Id }, messageToReturn);
            }

            throw new Exception("Creating the message failed on save");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int userId, int id)
        {
            // Check if the user calling the api is the actual user who's profile is requested to be modified
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var message = await repo.GetMessage(id);

            if (message.SenderId == userId)
            {
                message.SenderDeleted = true;
            }
            if (message.RecipientId == userId)
            {
                message.RecipientDeleted = true;
            }
            if (message.RecipientDeleted && message.SenderDeleted)
            {
                repo.Delete(message);
            }

            if (await repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("{senderId}/read")]
        public async Task<IActionResult> MarkMessagesAsRead(int userId, int senderId) {
            // Check if the user calling the api is the actual user who's profile is requested to be modified
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var messageParams = new MessageParams {
                
            };
            var unreadMessagesForUser = await repo.GetAllUnread(userId, senderId);

            foreach(Message m in unreadMessagesForUser) {
                m.IsRead = true;
                m.DateRead = DateTime.Now;
            }

            if (await repo.SaveAll() || unreadMessagesForUser.Count == 0)
            {
                return Ok();
            }

            return BadRequest();
        }

    }
}