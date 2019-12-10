module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          role_id: 1,
          isActive: true,
          email: 'fd@test.com',
          funeralName: 'funeral home',
          password:
            '$2a$12$6PHRtC13JOyxOudHjyjDnOymPrTOrLi0qtogoZJlZsV7/wQukgnjm',
          phoneNumber: '(624)321-6589',
          faxNumber: '123-456-7896',
          presetFuneralHomeId: 1,
          presetLocationId: 1,
          TwoFactorSecret: 'slfdkj',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'Jim',
          lastName: 'Dean',
          role_id: 2,
          isActive: true,
          rank: 'A1C',
          email: 'sch@test.com',
          unit: 'G Unit',
          funeralName: '',
          password:
            '$2a$12$6PHRtC13JOyxOudHjyjDnOymPrTOrLi0qtogoZJlZsV7/wQukgnjm',
          phoneNumber: '(624)321-6589',
          faxNumber: '123-456-7896',
          presetFuneralHomeId: 1,
          TwoFactorSecret: 'slfdkj',
          presetLocationId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'Bill',
          lastName: 'Deleteme',
          role_id: 2,
          isActive: true,
          rank: 'A1C',
          email: 'sch2@test.com',
          unit: 'G Unit',
          funeralName: '',
          password:
            '$2a$12$6PHRtC13JOyxOudHjyjDnOymPrTOrLi0qtogoZJlZsV7/wQukgnjm',
          phoneNumber: '(624)321-6589',
          faxNumber: '123-456-7896',
          presetFuneralHomeId: 1,
          presetLocationId: 1,
          TwoFactorSecret: 'slfdkj',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'Ted',
          lastName: 'Ishouldbedeleted',
          role_id: 2,
          isActive: false,
          rank: 'A1C',
          email: 'sch3@test.com',
          unit: 'G Unit',
          funeralName: '',
          password:
            '$2a$12$6PHRtC13JOyxOudHjyjDnOymPrTOrLi0qtogoZJlZsV7/wQukgnjm',
          phoneNumber: '(624)321-6589',
          faxNumber: '123-456-7896',
          presetFuneralHomeId: 1,
          presetLocationId: 1,
          TwoFactorSecret: 'slfdkj',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'Naomi',
          lastName: 'Enseoaisee',
          role_id: 3,
          isActive: true,
          rank: 'SrA',
          email: 'nco@test.com',
          unit: 'G Unit',
          funeralName: '',
          password:
            '$2a$12$6PHRtC13JOyxOudHjyjDnOymPrTOrLi0qtogoZJlZsV7/wQukgnjm',
          phoneNumber: '(624)321-6589',
          faxNumber: '123-456-7896',
          presetFuneralHomeId: 1,
          presetLocationId: 1,
          TwoFactorSecret: 'slfdkj',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
