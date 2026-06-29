import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShiftService } from './shift.service';
import { ProjectService } from './project.service';
import {
  CreateShiftDto,
  UpdateShiftDto,
  CreateShiftAssignmentDto,
  QueryShiftAssignmentDto,
  CreateProjectDto,
  UpdateProjectDto,
  CreateProjectTimeDto,
  QueryProjectTimeDto,
} from './dto/workforce.dto';

@ApiTags('HR Workforce')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HrWorkforceController {
  constructor(
    private readonly shifts: ShiftService,
    private readonly projects: ProjectService,
  ) {}

  // ── Shifts ────────────────────────────────────────────────────────────────
  @Get('shifts')
  @ApiOperation({ summary: 'List shifts' })
  listShifts() {
    return this.shifts.listShifts();
  }

  @Post('shifts')
  @ApiOperation({ summary: 'Create shift (privileged)' })
  createShift(@Request() req: any, @Body() dto: CreateShiftDto) {
    return this.shifts.createShift(req.user, dto);
  }

  @Patch('shifts/:id')
  @ApiOperation({ summary: 'Update shift (privileged)' })
  updateShift(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateShiftDto) {
    return this.shifts.updateShift(req.user, id, dto);
  }

  @Delete('shifts/:id')
  @ApiOperation({ summary: 'Delete shift (privileged)' })
  deleteShift(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.shifts.deleteShift(req.user, id);
  }

  // ── Shift assignments ───────────────────────────────────────────────────────
  @Get('shift-assignments')
  @ApiOperation({ summary: 'List shift assignments (own unless privileged)' })
  listAssignments(@Request() req: any, @Query() q: QueryShiftAssignmentDto) {
    return this.shifts.listAssignments(req.user, q);
  }

  @Post('shift-assignments')
  @ApiOperation({ summary: 'Assign shift to employee (privileged)' })
  createAssignment(@Request() req: any, @Body() dto: CreateShiftAssignmentDto) {
    return this.shifts.createAssignment(req.user, dto);
  }

  @Delete('shift-assignments/:id')
  @ApiOperation({ summary: 'Remove shift assignment (privileged)' })
  deleteAssignment(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.shifts.deleteAssignment(req.user, id);
  }

  // ── Projects ────────────────────────────────────────────────────────────────
  @Get('projects')
  @ApiOperation({ summary: 'List projects' })
  listProjects() {
    return this.projects.listProjects();
  }

  @Post('projects')
  @ApiOperation({ summary: 'Create project (privileged)' })
  createProject(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.projects.createProject(req.user, dto);
  }

  @Patch('projects/:id')
  @ApiOperation({ summary: 'Update project (privileged)' })
  updateProject(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.projects.updateProject(req.user, id, dto);
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: 'Delete project (privileged)' })
  deleteProject(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.projects.deleteProject(req.user, id);
  }

  // ── Project time entries ────────────────────────────────────────────────────
  @Get('project-time')
  @ApiOperation({ summary: 'List project time entries (own unless privileged)' })
  listTimeEntries(@Request() req: any, @Query() q: QueryProjectTimeDto) {
    return this.projects.listTimeEntries(req.user, q);
  }

  @Post('project-time')
  @ApiOperation({ summary: 'Log project time for self' })
  createTimeEntry(@Request() req: any, @Body() dto: CreateProjectTimeDto) {
    return this.projects.createTimeEntry(req.user, dto);
  }

  @Delete('project-time/:id')
  @ApiOperation({ summary: 'Delete project time entry (own unless privileged)' })
  deleteTimeEntry(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.projects.deleteTimeEntry(req.user, id);
  }
}
