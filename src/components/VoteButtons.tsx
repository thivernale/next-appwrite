import { Answer, Document, Question, Vote } from '@/services/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '@/store/Auth';
import { createVote, deleteVote } from '@/services/voteService';
import { useEffect, useState } from 'react';
import { updateAuthorReputation } from '@/services/userService';
import { useQuestionContext } from '@/context/QuestionContext';

export function VoteButtons({
  votes: initialVotes,
  type,
  typeId,
  authorId,
}: {
  votes: Document<Vote>[];
  type: 'question' | 'answer';
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

  function handleVote(direction: Vote['direction']) {
    if (!user) {
      return;
    }
    if (userVote) {
      const id = userVote.$id;
      deleteVote(id)
        .then(async () => {
          setVotes((prevState) => prevState.filter((vote) => vote.$id !== id));
          setUserVote(null);
          const userPrefs = await handleUpdateAuthorReputation(direction === 'up' ? -1 : 1);
          if (type === 'question' && question) {
            // TODO propagate change (vote count and author reputation) upward
            // TODO traverse question and update author reputation
            setQuestion({
              ...question,
              votesRel: (question.votesRel || []).filter((vote) => vote.$id !== id),
              author: { ...question.author, prefs: userPrefs! },
            });
          }
        })
        .then(() => handleUpdateAuthorReputation(direction === 'up' ? -1 : 1))
        .catch((reason) => console.log(reason));

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
      questionRel: (type !== 'answer' ? typeId : null) as unknown as Document<Question>,
    };
    createVote(data)
      .then(async (vote) => {
        setVotes((prevState) => [...prevState, vote]);
        setUserVote(vote);
        const userPrefs = await handleUpdateAuthorReputation(direction === 'up' ? 1 : -1);
        if (type === 'question' && question) {
          // TODO propagate change upward
          setQuestion({
            ...question,
            votesRel: [...(question.votesRel || []), vote],
            author: { ...question.author, prefs: userPrefs! },
          });
        }
      })
      .catch((reason) => console.log(reason));
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
          .map((vote) => (vote.direction === 'up' ? 1 : -1))
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
