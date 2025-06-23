import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/Auth';
import { Answer, Document, Question, Vote } from '@/services/types';
import { populateAuthorUserPrefs } from '@/services/userPrefs';
import { updateAuthorReputation } from '@/services/userService';
import { createVote, deleteVote } from '@/services/voteService';
import { useQuestionContext } from '@/context/QuestionContext';

export function VoteButtons({
  votes: initialVotes,
  type,
  typeId,
  authorId,
}: {
  votes: Document<Vote>[];
  type: Vote['type'];
  typeId: string;
  authorId: string;
}) {
  const [question, setQuestion] = useQuestionContext();
  const { user, updateUserPreferences } = useAuthStore();
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<Document<Vote> | null>();

  useEffect(() => {
    setUserVote(votes.find((v) => v.authorId === user?.$id));
  }, [votes, user]);

  function getVoteDelta(direction: Vote['direction']) {
    return direction === 'up' ? 1 : -1;
  }

  function handleVote(direction: Vote['direction']) {
    if (!user || !question) {
      toast.error('Please log in to vote');
      return;
    }
    if (userVote) {
      const id = userVote.$id;
      deleteVote(id)
        .then(async () => {
          setVotes((prevState) => prevState.filter((vote) => vote.$id !== id));
          setUserVote(() => null);
          const userPrefs = await handleUpdateAuthorReputation(-1 * getVoteDelta(direction));

          if (type === 'question') {
            question.votesRel = (question.votesRel ?? []).filter((vote) => vote.$id !== id);
          }
          setQuestion(populateAuthorUserPrefs(question, authorId, userPrefs));
        })
        .catch((reason) => toast.error(reason.message ?? 'Error deleting vote'));

      if (userVote.direction === direction) {
        return;
      }
    }
    // end delete

    const data = {
      direction,
      authorId: user.$id,
      type,
      typeId,
      answerRel: (type === 'answer' ? typeId : null) as unknown as Document<Answer>,
      questionRel: (type === 'question' ? typeId : null) as unknown as Document<Question>,
    };
    createVote(data)
      .then(async (vote) => {
        setVotes((prevState) => [...prevState, vote]);
        setUserVote(() => vote);
        const userPrefs = await handleUpdateAuthorReputation(getVoteDelta(direction));

        if (type === 'question') {
          question.votesRel = [...(question.votesRel ?? []), vote];
        }
        setQuestion(populateAuthorUserPrefs(question, authorId, userPrefs));
      })
      .catch((reason) => toast.error(reason.message ?? 'Error saving vote'));
  }

  async function handleUpdateAuthorReputation(delta: number) {
    if (!user) {
      throw new Error('User not logged in');
    }
    if (authorId === user.$id) {
      const userPrefs = {
        ...user.prefs,
        reputation: Number(user.prefs.reputation) + delta,
      };
      await updateUserPreferences(userPrefs);
      return userPrefs;
    } else {
      return updateAuthorReputation(authorId, delta);
    }
  }

  return (
    <>
      <button
        className={`mx-2 rounded-full border ${userVote?.direction === 'up' ? 'border-secondary' : 'border-gray-300'} p-1.5`}
        onClick={() => handleVote('up')}
      >
        <ChevronUp />
      </button>
      <span className="font-bold">
        {votes
          .map(({ direction }) => getVoteDelta(direction))
          .reduce((previousValue, currentValue) => previousValue + currentValue, 0)}
      </span>
      <button
        className={`mx-2 rounded-full border ${userVote?.direction === 'down' ? 'border-secondary' : 'border-gray-300'} p-1.5`}
        onClick={() => handleVote('down')}
      >
        <ChevronDown />
      </button>
    </>
  );
}
