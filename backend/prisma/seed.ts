import { PrismaClient, UserRole, TicketPriority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создаем службы
  const service1 = await prisma.service.upsert({
    where: { name: 'Техническая служба' },
    update: {},
    create: {
      name: 'Техническая служба',
      description: 'Обслуживание и ремонт аттракционов',
    },
  });

  const service2 = await prisma.service.upsert({
    where: { name: 'Служба безопасности' },
    update: {},
    create: {
      name: 'Служба безопасности',
      description: 'Обеспечение безопасности посетителей',
    },
  });

  const service3 = await prisma.service.upsert({
    where: { name: 'Служба уборки' },
    update: {},
    create: {
      name: 'Служба уборки',
      description: 'Поддержание чистоты на территории',
    },
  });

  // Создаем локации
  const location1 = await prisma.location.upsert({
    where: { id: 'loc-1' },
    update: {},
    create: {
      id: 'loc-1',
      name: 'Карусель "Вихрь"',
      description: 'Основная карусель в центре парка',
      serviceId: service1.id,
    },
  });

  const location2 = await prisma.location.upsert({
    where: { id: 'loc-2' },
    update: {},
    create: {
      id: 'loc-2',
      name: 'Американские горки "Гроза"',
      description: 'Экстремальные горки на севере парка',
      serviceId: service1.id,
    },
  });

  const location3 = await prisma.location.upsert({
    where: { id: 'loc-3' },
    update: {},
    create: {
      id: 'loc-3',
      name: 'Входная зона',
      description: 'Главный вход в парк',
      serviceId: service2.id,
    },
  });

  // Создаем пользователей
  const admin = await prisma.user.upsert({
    where: { telegramId: '123456789' },
    update: {},
    create: {
      telegramId: '123456789',
      firstName: 'Администратор',
      lastName: 'Системы',
      telegramUsername: 'admin',
      role: UserRole.ADMIN,
    },
  });

  const techLeader = await prisma.user.upsert({
    where: { telegramId: '987654321' },
    update: {},
    create: {
      telegramId: '987654321',
      firstName: 'Иван',
      lastName: 'Петров',
      telegramUsername: 'tech_leader',
      role: UserRole.SERVICE_LEADER,
      serviceId: service1.id,
    },
  });

  const executor = await prisma.user.upsert({
    where: { telegramId: '555666777' },
    update: {},
    create: {
      telegramId: '555666777',
      firstName: 'Алексей',
      lastName: 'Сидоров',
      telegramUsername: 'alex_executor',
      role: UserRole.EXECUTOR,
      serviceId: service1.id,
    },
  });

  const employee = await prisma.user.upsert({
    where: { telegramId: '111222333' },
    update: {},
    create: {
      telegramId: '111222333',
      firstName: 'Мария',
      lastName: 'Иванова',
      telegramUsername: 'maria_emp',
      role: UserRole.EMPLOYEE,
      serviceId: service1.id,
    },
  });

  // Создаем SLA политики
  await prisma.slaPolicy.upsert({
    where: { serviceId: service1.id },
    update: {},
    create: {
      serviceId: service1.id,
      responseTimeMinutes: 15,
      resolveTimeMinutes: 120,
    },
  });

  await prisma.slaPolicy.upsert({
    where: { serviceId: service2.id },
    update: {},
    create: {
      serviceId: service2.id,
      responseTimeMinutes: 5,
      resolveTimeMinutes: 30,
    },
  });

  await prisma.slaPolicy.upsert({
    where: { serviceId: service3.id },
    update: {},
    create: {
      serviceId: service3.id,
      responseTimeMinutes: 30,
      resolveTimeMinutes: 60,
    },
  });

  // Создаем теги
  const tag1 = await prisma.tag.upsert({
    where: { name: 'механика' },
    update: {},
    create: {
      name: 'механика',
      color: '#3B82F6',
    },
  });

  const tag2 = await prisma.tag.upsert({
    where: { name: 'электрика' },
    update: {},
    create: {
      name: 'электрика',
      color: '#EF4444',
    },
  });

  const tag3 = await prisma.tag.upsert({
    where: { name: 'срочно' },
    update: {},
    create: {
      name: 'срочно',
      color: '#F59E0B',
    },
  });

  // Создаем тестовые заявки
  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Поломка карусели "Вихрь"',
      description: 'Карусель не запускается, слышен скрежет в механизме',
      status: 'ASSIGNED',
      priority: TicketPriority.HIGH,
      serviceId: service1.id,
      locationId: location1.id,
      createdById: employee.id,
      assignedToId: executor.id,
      assignedAt: new Date(),
      slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 часа
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'Проблема с освещением на горках',
      description: 'Не работает освещение на американских горках',
      status: 'NEW',
      priority: TicketPriority.MEDIUM,
      serviceId: service1.id,
      locationId: location2.id,
      createdById: employee.id,
    },
  });

  // Добавляем теги к заявкам
  await prisma.ticketTag.createMany({
    data: [
      { ticketId: ticket1.id, tagId: tag1.id },
      { ticketId: ticket1.id, tagId: tag3.id },
      { ticketId: ticket2.id, tagId: tag2.id },
    ],
  });

  // Создаем комментарии
  await prisma.comment.create({
    data: {
      content: 'Проверил механизм, требуется замена подшипника',
      ticketId: ticket1.id,
      userId: executor.id,
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
